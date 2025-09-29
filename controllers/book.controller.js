import Book from "../models/book.model.js";


export const createBook = async (req, res) => {
  try {
    const { name, description, author, publishDate } = req.body;

    if (!name || !description || !author) {
      return res
        .status(400)
        .json({ message: "name, description, author are required" });
    }

    const newBook = await Book.create({
      name,
      description,
      author,
      publishDate: publishDate ? new Date(publishDate) : undefined,
    });

    res.status(201).json(newBook);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create book", error: error.message });
  }
};


export const getBooks = async (req, res) => {
  try {
    let {
      search,
      authors,
      from,
      to,
      page = 1,
      limit = 10,
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;

    const query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by authors (accepts multiple authors)
    if (authors) {
      const authorList = Array.isArray(authors) ? authors : authors.split(",");
      query.author = { $in: authorList.map(author => new RegExp(`^${author.trim()}$`, "i")) };
    }

    // Filter by publish date range
    if (from || to) {
      query.publishDate = {};
      if (from) query.publishDate.$gte = new Date(from);
      if (to) query.publishDate.$lte = new Date(to);
    }

    const pageNum = Math.max(1, parseInt(page));
    const pageLimit = Math.min(50, parseInt(limit));

    // Validate and set sort order
    const sortDirection = sortOrder === "desc" ? -1 : 1;

    // Execute the query
    const books = await Book.find(query)
      .sort({ [sortBy]: sortDirection })
      .skip((pageNum - 1) * pageLimit)
      .limit(pageLimit);

    const total = await Book.countDocuments(query);

    res.json({
      total,
      page: pageNum,
      limit: pageLimit,
      pages: Math.ceil(total / pageLimit),
      books,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch books", error: error.message });
  }
};
