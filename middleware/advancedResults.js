const advancedResults = (model, populate) => async (req, res, next) => {
    let query;
    const requestQuery = { ...req.query };

    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete requestQuery[param]);

    let queryStr = JSON.stringify(requestQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${ match }`);
    query = model.find(JSON.parse(queryStr));

    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();
    query = query.skip(startIndex).limit(limit);

    if (populate) {
        query = query.populate(populate);
    }

    const results = await query;

    const pagination = {
        page,
        limit,
        first: startIndex === 0,
        last: endIndex >= total,
        ...(endIndex < total) && { next: page + 1 },
        ...(startIndex > 0) && { previous: page - 1 }
    };

    res.advancedResults = {
        success: true,
        count: results.length,
        data: results,
        pagination
    };

    next();
};

module.exports = advancedResults;
