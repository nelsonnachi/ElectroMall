// 📄 Backend: utils/buildQuery.js (or whatever you named your class file)

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

  // ====================================================S
  // This method is to handle date filtering for orders
  dateFilter() {
    const { startDate, endDate } = this.queryStr;
    let dateQuery = {};

    if (startDate || endDate) {
      dateQuery.createdAt = {};
      if (startDate) {
        // Start from 12:00:00 AM of that day
        dateQuery.createdAt.$gte = new Date(new Date(startDate).setHours(0, 0, 0, 0));
      }
      if (endDate) {
        // End at 11:59:59 PM of that day
        dateQuery.createdAt.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
      }
      this.query = this.query.find(dateQuery);
    }
    return this;
  }

  // ====================================================F

  filter() {
    const queryCopy = { ...this.queryStr };
    const removeFields = ["keyword", "page", "limit", "sort", "startDate", "endDate"];
    removeFields.forEach((key) => delete queryCopy[key]);
    this.query = this.query.find(queryCopy);
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortOptions = {
        price_asc: { price: 1 }, 
        price_desc: { price: -1 }, 
        newest: { createdAt: -1 }, 
      };

      const sortBy = sortOptions[this.queryStr.sort] || { createdAt: -1 }; 
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort({ createdAt: -1 }); 
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
