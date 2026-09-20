import type { Book, BookProvider, BookSearchParams, BookSearchResult } from "./types";

const MOCK_BOOKS: Book[] = [
  {
    id: "mock-1",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    year: 2017,
    format: "EPUB / PDF",
    size: "14.2 MB",
    description:
      "The big ideas behind reliable, scalable, and maintainable systems. A deep dive into data storage, replication, partitioning, transactions, and distributed systems.",
    sourceUrl:
      "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/",
  },
  {
    id: "mock-2",
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    year: 2008,
    format: "PDF",
    size: "6.8 MB",
    description:
      "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Learn meaningful naming, small functions, and unit testing.",
    sourceUrl:
      "https://www.pearson.com/en-us/subject-catalog/p/clean-code-a-handbook-of-agile-software-craftsmanship/P200000000109",
  },
  {
    id: "mock-3",
    title: "The Pragmatic Programmer: Your Journey to Mastery",
    author: "David Thomas, Andrew Hunt",
    year: 2019,
    format: "EPUB",
    size: "8.5 MB",
    description:
      "20th Anniversary Edition. Pragmatic philosophy, career growth, code architecture, testing, and keeping your technical debt under control.",
    sourceUrl:
      "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
  },
  {
    id: "mock-4",
    title: "Atomic Habits",
    author: "James Clear",
    year: 2018,
    format: "EPUB / MOBI",
    size: "4.1 MB",
    description:
      "An easy & proven way to build good habits & break bad ones. Small changes that lead to remarkable, lasting results over time.",
    sourceUrl: "https://jamesclear.com/atomic-habits",
  },
  {
    id: "mock-5",
    title: "Project Hail Mary",
    author: "Andy Weir",
    year: 2021,
    format: "EPUB",
    size: "3.2 MB",
    description:
      "A lone astronaut must save the earth from disaster in this incredible new science-based space adventure from the author of The Martian.",
    sourceUrl: "https://www.penguinrandomhouse.com/books/611075/project-hail-mary-by-andy-weir/",
  },
  {
    id: "mock-6",
    title: "Dune",
    author: "Frank Herbert",
    year: 1965,
    format: "EPUB",
    size: "5.4 MB",
    description:
      "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.",
    sourceUrl: "https://en.wikipedia.org/wiki/Dune_(novel)",
  },
  {
    id: "mock-7",
    title: "Deep Work: Rules for Focused Success in a Distracted World",
    author: "Cal Newport",
    year: 2016,
    format: "PDF / EPUB",
    size: "3.9 MB",
    description:
      "Deep work is the ability to focus without distraction on a cognitively demanding task. Learn actionable disciplines to achieve elite productivity.",
    sourceUrl: "https://calnewport.com/deep-work/",
  },
  {
    id: "mock-8",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    year: 2014,
    format: "EPUB",
    size: "11.7 MB",
    description:
      "How did an insignificant ape become the ruler of planet Earth? A groundbreaking narrative exploring cognitive, agricultural, and scientific revolutions.",
    sourceUrl: "https://www.ynharari.com/book/sapiens-2/",
  },
  {
    id: "mock-9",
    title: "Structure and Interpretation of Computer Programs (SICP)",
    author: "Harold Abelson, Gerald Jay Sussman",
    year: 1996,
    format: "PDF",
    size: "9.1 MB",
    description:
      "The classic MIT textbook on computing, functional programming, recursion, abstraction, and the mechanics of interpretation.",
    sourceUrl:
      "https://mitpress.mit.edu/9780262510875/structure-and-interpretation-of-computer-programs/",
  },
  {
    id: "mock-10",
    title: "1984",
    author: "George Orwell",
    year: 1949,
    format: "EPUB / PDF",
    size: "2.3 MB",
    description:
      "The definitive dystopian masterpiece depicting total surveillance, government propaganda, doublethink, and the erosion of individual truth.",
    sourceUrl: "https://en.wikipedia.org/wiki/Nineteen_Eighty-Four",
  },
];

export class MockBookProvider implements BookProvider {
  public readonly name = "MockBookProvider";

  async search(params: BookSearchParams): Promise<BookSearchResult> {
    const rawQuery = (params.query || "").trim().toLowerCase();
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 5);

    const filtered = rawQuery
      ? MOCK_BOOKS.filter(
          (b) =>
            b.title.toLowerCase().includes(rawQuery) ||
            b.author.toLowerCase().includes(rawQuery) ||
            (b.description && b.description.toLowerCase().includes(rawQuery)),
        )
      : MOCK_BOOKS;

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      books: paginated,
      total,
      page,
      totalPages,
    };
  }

  async getBookDetails(id: string): Promise<Book | null> {
    const found = MOCK_BOOKS.find((b) => b.id === id);
    return found || null;
  }

  async getFeatured(): Promise<Book[]> {
    return MOCK_BOOKS.slice(0, 5);
  }
}

export const mockProvider = new MockBookProvider();
