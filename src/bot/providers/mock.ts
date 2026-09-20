import type { Book, BookProvider, SearchResult } from "./types";

// Public-domain titles with real Open Library covers and Project Gutenberg links,
// so the end-to-end flow (covers, source buttons) is realistic.
const gutenberg = (id: number) => [
  { label: "📥 EPUB", url: `https://www.gutenberg.org/ebooks/${id}.epub3.images` },
  { label: "🌐 Read online", url: `https://www.gutenberg.org/ebooks/${id}` },
];
const cover = (olid: string) => `https://covers.openlibrary.org/b/olid/${olid}-L.jpg`;

const BOOKS: Book[] = [
  {
    id: "m1",
    title: "Pride and Prejudice",
    authors: ["Jane Austen"],
    year: 1813,
    language: "English",
    format: "EPUB",
    fileSizeBytes: 812_000,
    coverUrl: cover("OL22903116M"),
    description:
      "Elizabeth Bennet navigates manners, morality and marriage in Regency England, sparring with the proud Mr Darcy until both learn to see past first impressions.",
    sources: gutenberg(1342),
  },
  {
    id: "m2",
    title: "Emma",
    authors: ["Jane Austen"],
    year: 1815,
    language: "English",
    format: "EPUB",
    fileSizeBytes: 934_000,
    coverUrl: cover("OL24363567M"),
    description:
      "Handsome, clever and rich, Emma Woodhouse meddles in the romantic lives of her friends with far more confidence than skill.",
    sources: gutenberg(158),
  },
  {
    id: "m3",
    title: "Sense and Sensibility",
    authors: ["Jane Austen"],
    year: 1811,
    language: "English",
    format: "EPUB",
    fileSizeBytes: 760_000,
    coverUrl: cover("OL7213629M"),
    description:
      "The Dashwood sisters, one ruled by sense and the other by sensibility, face love and heartbreak after their father's death leaves them with little.",
    sources: gutenberg(161),
  },
  {
    id: "m4",
    title: "Dracula",
    authors: ["Bram Stoker"],
    year: 1897,
    language: "English",
    format: "EPUB",
    fileSizeBytes: 1_050_000,
    coverUrl: cover("OL24364628M"),
    description:
      "Told through letters and diaries, the story of Count Dracula's attempt to move from Transylvania to England and the small group who hunt him.",
    sources: gutenberg(345),
  },
  {
    id: "m5",
    title: "Frankenstein; or, The Modern Prometheus",
    authors: ["Mary Wollstonecraft Shelley"],
    year: 1818,
    language: "English",
    format: "EPUB",
    fileSizeBytes: 540_000,
    coverUrl: cover("OL24390613M"),
    description:
      "Victor Frankenstein creates a living being and abandons it, setting off a tragedy that follows him to the Arctic ice.",
    sources: gutenberg(84),
  },
  {
    id: "m6",
    title: "Moby-Dick; or, The Whale",
    authors: ["Herman Melville"],
    year: 1851,
    language: "English",
    format: "EPUB",
    fileSizeBytes: 1_480_000,
    coverUrl: cover("OL24379139M"),
    description:
      "Ishmael joins the whaling ship Pequod, whose captain Ahab is consumed by his hunt for the white whale that took his leg.",
    sources: gutenberg(2701),
  },
  {
    id: "m7",
    title: "The Adventures of Sherlock Holmes",
    authors: ["Arthur Conan Doyle"],
    year: 1892,
    language: "English",
    format: "EPUB",
    fileSizeBytes: 690_000,
    coverUrl: cover("OL24219181M"),
    description:
      "Twelve short stories featuring the consulting detective and Dr Watson, including A Scandal in Bohemia and The Red-Headed League.",
    sources: gutenberg(1661),
  },
  {
    id: "m8",
    title: "The Hound of the Baskervilles",
    authors: ["Arthur Conan Doyle"],
    year: 1902,
    language: "English",
    format: "EPUB",
    fileSizeBytes: 480_000,
    coverUrl: cover("OL7218946M"),
    description:
      "Holmes and Watson investigate a legendary spectral hound said to haunt the Baskerville family on Dartmoor.",
    sources: gutenberg(2852),
  },
  {
    id: "m9",
    title: "Crime and Punishment",
    authors: ["Fyodor Dostoyevsky"],
    year: 1866,
    language: "English",
    format: "EPUB",
    fileSizeBytes: 1_320_000,
    coverUrl: cover("OL24339469M"),
    description:
      "Impoverished student Raskolnikov commits a murder he believes is justified, then unravels under guilt and the attention of a patient detective.",
    sources: gutenberg(2554),
  },
  {
    id: "m10",
    title: "The Brothers Karamazov",
    authors: ["Fyodor Dostoyevsky"],
    year: 1880,
    language: "English",
    format: "EPUB",
    fileSizeBytes: 2_100_000,
    coverUrl: cover("OL24261218M"),
    description:
      "Three brothers, a dissolute father and a murder: a philosophical novel about faith, doubt, free will and family.",
    sources: gutenberg(28054),
  },
  {
    id: "m11",
    title: "Great Expectations",
    authors: ["Charles Dickens"],
    year: 1861,
    language: "English",
    format: "EPUB",
    fileSizeBytes: 1_150_000,
    coverUrl: cover("OL24350234M"),
    description:
      "Orphan Pip is raised from humble beginnings by a mysterious benefactor and learns what it really means to be a gentleman.",
    sources: gutenberg(1400),
  },
  {
    id: "m12",
    title: "A Tale of Two Cities",
    authors: ["Charles Dickens"],
    year: 1859,
    language: "English",
    format: "EPUB",
    fileSizeBytes: 890_000,
    coverUrl: cover("OL24356338M"),
    description:
      "Set in London and Paris before and during the French Revolution, following Charles Darnay and Sydney Carton.",
    sources: gutenberg(98),
  },
  {
    id: "m13",
    title: "The Picture of Dorian Gray",
    authors: ["Oscar Wilde"],
    year: 1890,
    language: "English",
    format: "EPUB",
    fileSizeBytes: 520_000,
    coverUrl: cover("OL24384516M"),
    description:
      "A beautiful young man stays forever young while his portrait bears the marks of his age and corruption.",
    sources: gutenberg(174),
  },
  {
    id: "m14",
    title: "Jane Eyre",
    authors: ["Charlotte Brontë"],
    year: 1847,
    language: "English",
    format: "EPUB",
    fileSizeBytes: 1_060_000,
    coverUrl: cover("OL24387433M"),
    description:
      "An orphaned governess falls in love with her brooding employer, Mr Rochester, who hides a terrible secret at Thornfield Hall.",
    sources: gutenberg(1260),
  },
  {
    id: "m15",
    title: "Wuthering Heights",
    authors: ["Emily Brontë"],
    year: 1847,
    language: "English",
    format: "EPUB",
    fileSizeBytes: 640_000,
    coverUrl: cover("OL24387434M"),
    description:
      "The wild, destructive love between Catherine Earnshaw and Heathcliff on the Yorkshire moors, told across two generations.",
    sources: gutenberg(768),
  },
  {
    id: "m16",
    title: "The War of the Worlds",
    authors: ["H. G. Wells"],
    year: 1898,
    language: "English",
    format: "EPUB",
    fileSizeBytes: 430_000,
    coverUrl: cover("OL24387480M"),
    description:
      "Martians land in Surrey and lay waste to southern England in one of the first alien-invasion stories.",
    sources: gutenberg(36),
  },
  {
    id: "m17",
    title: "The Time Machine",
    authors: ["H. G. Wells"],
    year: 1895,
    language: "English",
    format: "EPUB",
    fileSizeBytes: 280_000,
    coverUrl: cover("OL7202584M"),
    description:
      "An inventor travels to the year 802,701 and finds humanity split into the gentle Eloi and the subterranean Morlocks.",
    sources: gutenberg(35),
  },
  {
    id: "m18",
    title: "Alice's Adventures in Wonderland",
    authors: ["Lewis Carroll"],
    year: 1865,
    language: "English",
    format: "EPUB",
    fileSizeBytes: 3_200_000,
    coverUrl: cover("OL24387479M"),
    description:
      "Alice follows a white rabbit down a hole into a world of talking animals, mad tea parties and a card-playing queen.",
    sources: gutenberg(11),
  },
  {
    id: "m19",
    title: "Meditations",
    authors: ["Marcus Aurelius"],
    year: 180,
    language: "English",
    format: "EPUB",
    fileSizeBytes: 350_000,
    coverUrl: cover("OL7091417M"),
    description:
      "The private notebooks of a Roman emperor practising Stoic philosophy: on duty, mortality and keeping a steady mind.",
    sources: gutenberg(2680),
  },
  {
    id: "m20",
    title: "The Art of War",
    authors: ["Sun Tzu"],
    year: -500,
    language: "English",
    format: "EPUB",
    fileSizeBytes: 210_000,
    coverUrl: cover("OL24316778M"),
    description:
      "Thirteen chapters on strategy, deception and leadership that have been applied far beyond the battlefield.",
    sources: gutenberg(132),
  },
];

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export class MockBookProvider implements BookProvider {
  readonly name = "mock";

  async search(query: string, page: number, pageSize: number): Promise<SearchResult> {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    const matches = BOOKS.filter((b) => {
      const hay = normalize(`${b.title} ${b.authors.join(" ")} ${b.description ?? ""}`);
      return terms.every((t) => hay.includes(t));
    });

    const total = matches.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * pageSize;

    return {
      items: matches.slice(start, start + pageSize),
      page: safePage,
      pageSize,
      total,
      hasPrev: safePage > 1,
      hasNext: safePage < totalPages,
    };
  }

  async getById(id: string): Promise<Book | null> {
    return BOOKS.find((b) => b.id === id) ?? null;
  }

  async featured(): Promise<Book[]> {
    return ["m1", "m4", "m7", "m6", "m19"]
      .map((id) => BOOKS.find((b) => b.id === id)!)
      .filter(Boolean);
  }
}
