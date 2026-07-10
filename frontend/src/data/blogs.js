// Blog content store — temporary until CMS is built.
// Note: long-form content excerpted from Wikipedia (CC BY-SA) for demo.

export const BLOGS = [
  {
    slug: "proto-language",
    title: "On Proto-Languages",
    subtitle:
      "How we reconstruct the ancestor of a language family — and what that tells us about reconstruction in any system.",
    author: "Prof. A. Rao",
    role: "Faculty · CiPD",
    date: "12 Feb 2026",
    readTime: "9 min read",
    tag: "Essay",
    paragraphs: [
      "In the tree model of historical linguistics, a proto-language is a postulated ancestral language from which a number of attested languages are believed to have descended by evolution, forming a language family. Proto-languages are usually unattested, or partially attested at best. They are reconstructed by way of the comparative method.",
      "In the family-tree metaphor, a proto-language can be called a mother language. Occasionally, the German term Ursprache (from ur- 'primordial, original' + Sprache 'language') is used instead. It is also sometimes called the common or primitive form of a language — Common Germanic, Primitive Norse.",
      "In the strict sense, a proto-language is the most recent common ancestor of a language family, immediately before the family started to diverge into the attested daughter languages. It is therefore equivalent to the ancestral or parental language of a family. Moreover, a group of lects that are not considered separate languages, such as the members of a dialect cluster, may also be described as descending from a unitary proto-language.",
      "Typically, the proto-language is not known directly. It is by definition a linguistic reconstruction formulated by applying the comparative method to a group of languages featuring similar characteristics. The tree is a statement of similarity and a hypothesis that the similarity results from descent from a common language.",
      "The comparative method, a process of deduction, begins from a set of characteristics found in the attested languages. If the entire set can be accounted for by descent from the proto-language — which must contain the proto-forms of them all — the tree, or phylogeny, is regarded as a complete explanation and, by Occam's razor, given credibility. More recently, such a tree has been termed 'perfect' and the characters labelled 'compatible'.",
      "No trees but the smallest branches are ever found to be perfect, in part because languages also evolve through horizontal transfer with their neighbours. Typically, credibility is given to the hypotheses of highest compatibility. The differences in compatibility must be explained by various applications of the wave model.",
      "Some universally accepted proto-languages are Proto-Afroasiatic, Proto-Indo-European, Proto-Uralic and Proto-Dravidian. In a few fortuitous instances — Latin for the Romance languages, Vedic Sanskrit for the Indo-Aryan languages — a literary history exists from as early as a few millennia ago, allowing descent to be traced in detail.",
      "Normally, the term 'Proto-X' refers to the last common ancestor of a group of languages, occasionally attested but most commonly reconstructed through the comparative method. An earlier stage of a single language X, reconstructed through the method of internal reconstruction, is termed 'Pre-X', as in Pre-Old Japanese. It is also possible to apply internal reconstruction to a proto-language, obtaining a pre-proto-language such as Pre-Proto-Indo-European.",
      "There are no objective criteria for the evaluation of different reconstruction systems yielding different proto-languages. Many researchers concerned with linguistic reconstruction agree that the traditional comparative method is an 'intuitive undertaking.' The bias of the researchers regarding the accumulated implicit knowledge can also lead to erroneous assumptions and excessive generalisation. As reconstructions tend to have a strong bias toward the average language type known to the investigator, every reconstructed system is also a portrait of its reconstructor.",
      "The advent of the wave model raised new issues in the domain of linguistic reconstruction, depriving the proto-language of its 'uniform character.' Karl Brugmann doubted that reconstruction systems could ever reflect a linguistic reality; Ferdinand de Saussure went further, rejecting any positive specification of their sound values. In general, the issue of the nature of proto-language remains unresolved, with linguists generally taking either the realist or the abstractionist position.",
    ],
  },
  {
    slug: "what-is-a-blog",
    title: "What Is a Blog, Really?",
    subtitle:
      "A short anthropology of the form — from late-90s diary pages to the multi-author publications of today.",
    author: "Dr. Anuj Grover",
    role: "Faculty · CiPD",
    date: "04 Feb 2026",
    readTime: "6 min read",
    tag: "Note",
    paragraphs: [
      "A blog — a truncation of 'weblog' — is an informational website consisting of discrete, often informal diary-style text entries also known as posts. Posts are typically displayed in reverse chronological order so that the most recent post appears first, at the top of the web page.",
      "In the 2000s, blogs were often the work of a single individual, occasionally of a small group, and often covered a single subject or topic. In the 2010s, multi-author blogs (MABs) emerged, featuring the writing of multiple authors, sometimes professionally edited. MABs from newspapers, other media outlets, universities, think tanks and advocacy groups account for an increasing quantity of blog traffic.",
      "The rise of Twitter and other microblogging systems helps integrate MABs and single-author blogs into the news media. Blog can also be used as a verb, meaning to maintain or add content to a blog.",
      "The emergence and growth of blogs in the late 1990s coincided with the advent of web publishing tools that facilitated the posting of content by non-technical users who did not have much experience with HTML or computer programming. Previously, knowledge of such technologies as HTML and File Transfer Protocol had been required to publish content on the Web, and early Web users therefore tended to be hackers and computer enthusiasts.",
      "As of the 2010s, the majority of blogs are interactive Web 2.0 websites, allowing visitors to leave online comments, and it is this interactivity that distinguishes them from other static websites. In that sense, blogging can be seen as a form of social networking service. Bloggers not only produce content to post on their blogs but also often build social relations with their readers and other bloggers. Blog owners or authors often moderate and filter online comments to remove hate speech or other offensive content.",
      "Many blogs provide commentary on a particular subject or topic, ranging from philosophy, religion and arts to science, politics and sports. Others function as more personal online diaries or as online brand advertising of a particular individual or company. A typical blog combines text, digital images and links to other blogs, web pages and other media related to its topic.",
      "Most blogs are primarily textual, although some focus on art (art blogs), photographs (photoblogs), videos (video blogs or vlogs), music (MP3 blogs) and audio (podcasts). In education, blogs can be used as instructional resources; these are referred to as edublogs. Microblogging is another type of blogging, featuring very short posts.",
      "Blog and blogging are now loosely used for content creation and sharing on social media, especially when the content is long-form and one creates and shares content on a regular basis, so one could be maintaining a blog on Facebook or blogging on Instagram. A 2022 estimate suggested that there were over 600 million public blogs out of more than 1.9 billion websites.",
      "The term 'weblog' was coined by Jorn Barger on 17 December 1997. The short form 'blog' was coined by Peter Merholz, who jokingly broke the word weblog into the phrase 'we blog' in the sidebar of his blog Peterme.com in May 1999. Shortly thereafter, Evan Williams at Pyra Labs used 'blog' as both a noun and verb and devised the term 'blogger' in connection with Pyra Labs' Blogger product, popularising the terms.",
    ],
  },
];

export function getBlog(slug) {
  return BLOGS.find((b) => b.slug === slug);
}
