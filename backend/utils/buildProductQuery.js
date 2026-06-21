class buildProductQuery {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    // Remove fields that should not be used as MongoDB filters
    const removeFields = ["keyword", "page", "limit", "sort"];
    removeFields.forEach((key) => delete queryCopy[key]);
    this.query = this.query.find(queryCopy);
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      // These keys must match the exact option values you created in AllProducts.jsx
      const sortOptions = {
        price_asc: { price: 1 }, // Lowest price first
        price_desc: { price: -1 }, // Highest price first
        newest: { createdAt: -1 }, // Most recent date first (Assumes timestamps: true on schema)
      };

      const sortBy = sortOptions[this.queryStr.sort] || { createdAt: -1 }; // Fallback option
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort({ createdAt: -1 }); // Default fallback sorting mechanism
    }
    return this;
  }

  pagination(resultsPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultsPerPage * (currentPage - 1);
    this.query = this.query.limit(resultsPerPage).skip(skip);
    return this;
  }
}

export default buildProductQuery;
