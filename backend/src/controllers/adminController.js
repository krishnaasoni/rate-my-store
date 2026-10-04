const bcrypt = require('bcryptjs');
const prisma = require('../config/db');

/**
 * GET /api/admin/dashboard
 * Fetch system administrator statistics
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalStores,
        totalRatings,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users
 * View list of normal, admin, and store owner users with filters and sorting
 */
const getUsers = async (req, res, next) => {
  try {
    const { search, role, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const where = {};

    // Filter by role if specified
    if (role && ['ADMIN', 'USER', 'STORE_OWNER'].includes(role.toUpperCase())) {
      where.role = role.toUpperCase();
    }

    // Search filter across Name, Email, Address
    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
        { address: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    // Determine orderBy field
    const validSortFields = ['name', 'email', 'address', 'role', 'createdAt'];
    const orderByField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderDirection = sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        stores: {
          select: {
            id: true,
            name: true,
            ratings: {
              select: { rating: true },
            },
          },
        },
      },
      orderBy: {
        [orderByField]: orderDirection,
      },
    });

    // Format response to include average rating for store owners
    const formattedUsers = users.map((u) => {
      let storeRating = null;
      let storeName = null;

      if (u.role === 'STORE_OWNER' && u.stores.length > 0) {
        storeName = u.stores[0].name;
        const allRatings = u.stores.flatMap((s) => s.ratings.map((r) => r.rating));
        if (allRatings.length > 0) {
          const sum = allRatings.reduce((acc, curr) => acc + curr, 0);
          storeRating = parseFloat((sum / allRatings.length).toFixed(1));
        } else {
          storeRating = 0;
        }
      }

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        address: u.address,
        role: u.role,
        createdAt: u.createdAt,
        storeName,
        storeRating,
      };
    });

    res.status(200).json({
      success: true,
      count: formattedUsers.length,
      users: formattedUsers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users/:id
 * View details of a specific user. Displays rating if user is Store Owner.
 */
const getUserById = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid User ID',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        stores: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            ratings: {
              select: {
                id: true,
                rating: true,
                createdAt: true,
                user: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    let storeDetails = null;
    if (user.role === 'STORE_OWNER' && user.stores.length > 0) {
      const store = user.stores[0];
      const ratings = store.ratings;
      const totalRatingsCount = ratings.length;
      const averageRating =
        totalRatingsCount > 0
          ? parseFloat((ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatingsCount).toFixed(1))
          : 0;

      storeDetails = {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating,
        totalRatingsCount,
        ratings,
      };
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
        storeDetails,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/users
 * Add new user (ADMIN, USER, or STORE_OWNER)
 */
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        address,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: `New ${role} user created successfully.`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/stores
 * View list of stores with overall average rating, search filters, and sorting
 */
const getStores = async (req, res, next) => {
  try {
    const { search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const where = {};

    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
        { address: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const stores = await prisma.store.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        createdAt: true,
        owner: {
          select: { id: true, name: true, email: true },
        },
        ratings: {
          select: { rating: true },
        },
      },
    });

    // Compute overall average rating per store
    let formattedStores = stores.map((s) => {
      const totalRatingsCount = s.ratings.length;
      const averageRating =
        totalRatingsCount > 0
          ? parseFloat((s.ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatingsCount).toFixed(1))
          : 0;

      return {
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        owner: s.owner,
        averageRating,
        totalRatingsCount,
        createdAt: s.createdAt,
      };
    });

    // Sort formatted stores
    const order = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
    if (sortBy === 'rating') {
      formattedStores.sort((a, b) => (a.averageRating - b.averageRating) * order);
    } else if (['name', 'email', 'address'].includes(sortBy)) {
      formattedStores.sort((a, b) => a[sortBy].localeCompare(b[sortBy]) * order);
    } else {
      // Default: createdAt
      formattedStores.sort((a, b) => (new Date(a.createdAt) - new Date(b.createdAt)) * order);
    }

    res.status(200).json({
      success: true,
      count: formattedStores.length,
      stores: formattedStores,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/stores
 * Add a new store and assign it to a Store Owner
 */
const createStore = async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;

    // Verify owner exists
    const owner = await prisma.user.findUnique({
      where: { id: parseInt(ownerId, 10) },
    });

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Assigned store owner user not found.',
      });
    }

    // Ensure user role is STORE_OWNER
    if (owner.role !== 'STORE_OWNER') {
      await prisma.user.update({
        where: { id: owner.id },
        data: { role: 'STORE_OWNER' },
      });
    }

    const store = await prisma.store.create({
      data: {
        name,
        email: email.toLowerCase(),
        address,
        ownerId: owner.id,
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'New store created and owner assigned successfully.',
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        owner: store.owner,
        createdAt: store.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getUserById,
  createUser,
  getStores,
  createStore,
};
