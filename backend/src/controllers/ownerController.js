const prisma = require('../config/db');

/**
 * GET /api/owner/dashboard
 * Store Owner Dashboard: List of users who rated their store & average rating
 */
const getOwnerDashboard = async (req, res, next) => {
  try {
    const ownerId = req.user.id;

    // Fetch stores owned by this Store Owner
    const stores = await prisma.store.findMany({
      where: { ownerId },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        createdAt: true,
        ratings: {
          select: {
            id: true,
            rating: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                address: true,
              },
            },
          },
          orderBy: {
            updatedAt: 'desc',
          },
        },
      },
    });

    if (stores.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No stores assigned to this Store Owner yet.',
        dashboard: null,
      });
    }

    // Process primary store (or list of stores)
    const primaryStore = stores[0];
    const totalRatingsCount = primaryStore.ratings.length;
    const averageRating =
      totalRatingsCount > 0
        ? parseFloat(
            (primaryStore.ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatingsCount).toFixed(1)
          )
        : 0;

    // Map list of users who submitted ratings
    const ratingUsers = primaryStore.ratings.map((r) => ({
      ratingId: r.id,
      rating: r.rating,
      submittedAt: r.updatedAt,
      user: {
        id: r.user.id,
        name: r.user.name,
        email: r.user.email,
        address: r.user.address,
      },
    }));

    res.status(200).json({
      success: true,
      dashboard: {
        store: {
          id: primaryStore.id,
          name: primaryStore.name,
          email: primaryStore.email,
          address: primaryStore.address,
        },
        averageRating,
        totalRatingsCount,
        ratingUsers,
        allOwnedStores: stores.map((st) => ({
          id: st.id,
          name: st.name,
          totalRatings: st.ratings.length,
          avgRating:
            st.ratings.length > 0
              ? parseFloat((st.ratings.reduce((a, b) => a + b.rating, 0) / st.ratings.length).toFixed(1))
              : 0,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOwnerDashboard,
};
