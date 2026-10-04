const prisma = require('../config/db');

/**
 * GET /api/stores
 * Fetch all registered stores with overall rating and logged-in user's submitted rating
 */
const getStores = async (req, res, next) => {
  try {
    const { search, sortBy = 'name', sortOrder = 'asc' } = req.query;
    const userId = req.user ? req.user.id : null;

    const where = {};

    // Search by Name and Address
    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
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
        ratings: {
          select: {
            id: true,
            userId: true,
            rating: true,
            updatedAt: true,
          },
        },
      },
    });

    // Format response and compute ratings
    let formattedStores = stores.map((s) => {
      const totalRatingsCount = s.ratings.length;
      const overallRating =
        totalRatingsCount > 0
          ? parseFloat((s.ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatingsCount).toFixed(1))
          : 0;

      const userRatingObj = userId ? s.ratings.find((r) => r.userId === userId) : null;

      return {
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        overallRating,
        totalRatingsCount,
        userRating: userRatingObj ? userRatingObj.rating : null,
        userRatingId: userRatingObj ? userRatingObj.id : null,
        createdAt: s.createdAt,
      };
    });

    // Handle sorting
    const order = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
    if (sortBy === 'rating' || sortBy === 'overallRating') {
      formattedStores.sort((a, b) => (a.overallRating - b.overallRating) * order);
    } else if (sortBy === 'userRating') {
      formattedStores.sort((a, b) => ((a.userRating || 0) - (b.userRating || 0)) * order);
    } else if (['name', 'address', 'email'].includes(sortBy)) {
      formattedStores.sort((a, b) => a[sortBy].localeCompare(b[sortBy]) * order);
    } else {
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
 * POST /api/ratings
 * Submit a rating (1 to 5) for a store. Updates existing rating if already rated.
 */
const submitRating = async (req, res, next) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    // Check store exists
    const store = await prisma.store.findUnique({
      where: { id: parseInt(storeId, 10) },
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found.',
      });
    }

    // Upsert rating using compound unique key [userId, storeId]
    const ratingEntry = await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId,
          storeId: store.id,
        },
      },
      update: {
        rating: parseInt(rating, 10),
      },
      create: {
        userId,
        storeId: store.id,
        rating: parseInt(rating, 10),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Rating submitted successfully.',
      rating: ratingEntry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/ratings/:id
 * Modify a previously submitted rating
 */
const updateRating = async (req, res, next) => {
  try {
    const ratingId = parseInt(req.params.id, 10);
    const { rating } = req.body;
    const userId = req.user.id;

    const existingRating = await prisma.rating.findUnique({
      where: { id: ratingId },
    });

    if (!existingRating) {
      return res.status(404).json({
        success: false,
        message: 'Rating record not found.',
      });
    }

    // Ensure user owns this rating record
    if (existingRating.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only modify your own submitted ratings.',
      });
    }

    const updatedRating = await prisma.rating.update({
      where: { id: ratingId },
      data: {
        rating: parseInt(rating, 10),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Rating updated successfully.',
      rating: updatedRating,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStores,
  submitRating,
  updateRating,
};
