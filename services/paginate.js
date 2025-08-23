const Services = require("./services");

class Paginate {
  /**
   * @param {object} req
   * @param {object} model
   * @returns {object}
   */
  async main(
    req,
    model,
    { query = {}, populate = [], projection = {}, sort = {}, keySearch = "name" } = {}
  ) {
    const pageNumber = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.limit) || 12;
    const apiRoute = req.baseUrl + req.path;
    const searchKeyword = req.query.search;

    if (searchKeyword) {
      const regex = new RegExp(searchKeyword, "i");
      query = { ...query, [keySearch]: regex };
    }

    const totalRecords = await model.countDocuments(query);

    const skipIndex = (pageNumber - 1) * perPage;

    let mainQuery;

    if (Object.keys(projection).length > 0) {
      mainQuery = model.find(query, projection);
    } else {
      mainQuery = model.find(query);
    }

    if (Object.keys(sort).length > 0) mainQuery = mainQuery.sort(sort);

    mainQuery = mainQuery.limit(perPage).skip(skipIndex);

    if (populate && populate.length > 0) {
      mainQuery = mainQuery.populate(populate).exec();
    }

    const paginateRecords = await mainQuery; // excute query

    const totalPages = Math.ceil(totalRecords / perPage);

    const urls = [];

    for (let index = 1; index <= totalPages; index++) {
      let url = Services.url_be(`${apiRoute}?page=${index}&limit=${perPage}`);
      if (searchKeyword) url += `&search=${searchKeyword}`;
      const is_current = index == pageNumber;
      urls.push({ url, is_current, label: index });
    }

    const is_next_page = pageNumber < totalPages;
    const is_prev_page = pageNumber > 1;

    let url_next_page = is_next_page
      ? Services.url_be(`${apiRoute}?page=${pageNumber + 1}&limit=${perPage}`)
      : "";
    let url_prev_page = is_prev_page
      ? Services.url_be(`${apiRoute}?page=${pageNumber - 1}&limit=${perPage}`)
      : "";

    if (searchKeyword) {
      if (url_next_page) url_next_page += `&search=${searchKeyword}`;
      if (url_prev_page) url_next_page += `&search=${searchKeyword}`;
    }

    const paginate = {
      is_next_page, // is exits next page
      is_prev_page, // is exits prev page
      url_pages: urls, // all urls pages
      url_prev_page, // url of prev page
      url_next_page, // url of next page
      total_pages: totalPages, // number of pages
      current_page: pageNumber, // the number which is label of current page
      total_records_in_page: paginateRecords.length, // number of records in page
      total_all_records: totalRecords, // number of all records
    };

    return {
      data: paginateRecords,
      paginate,
    };
  }
}
module.exports = new Paginate();
