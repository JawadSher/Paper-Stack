import type { Board, ClassLevel, Paper, Subject } from "@/types";

export interface CommonQuestion {
  id: string;
  text: string;
  chapterId: string;
  chapterName: string;
  subjectId: Subject["id"];
  classId: ClassLevel;
  years: number[];
  boardIds: Board["id"][];
  paperRefs: {
    paperId: Paper["id"];
    year: number;
    boardId: Board["id"];
  }[];
}

const boards = ["bise-lahore", "fbise", "bise-rawalpindi", "bise-gujranwala"];

function createQuestion(
  id: string,
  subjectId: string,
  chapterId: string,
  chapterName: string,
  text: string,
  years: number[],
  boardIds = boards,
): CommonQuestion {
  return {
    id,
    text,
    chapterId,
    chapterName,
    subjectId,
    classId: 10,
    years,
    boardIds,
    paperRefs: years.map((year) => ({
      paperId: `${boardIds[0]}-10-${subjectId}-${year}-annual`,
      year,
      boardId: boardIds[0],
    })),
  };
}

export const commonQuestions: CommonQuestion[] = [
  createQuestion(
    "phy-01",
    "class-10-physics",
    "phy-ch-10",
    "Chapter 10: Simple Harmonic Motion and Waves",
    "Define simple harmonic motion and prove that the motion of a simple pendulum is SHM for small amplitude.",
    [2019, 2020, 2021, 2022, 2023],
  ),
  createQuestion(
    "phy-02",
    "class-10-physics",
    "phy-ch-10",
    "Chapter 10: Simple Harmonic Motion and Waves",
    "Differentiate between transverse and longitudinal waves with examples from daily life.",
    [2019, 2021, 2022, 2023],
  ),
  createQuestion(
    "phy-03",
    "class-10-physics",
    "phy-ch-11",
    "Chapter 11: Sound",
    "Explain echoes and write the conditions necessary to hear an echo clearly.",
    [2020, 2021, 2022, 2023],
  ),
  createQuestion(
    "phy-04",
    "class-10-physics",
    "phy-ch-11",
    "Chapter 11: Sound",
    "Describe ultrasound and mention two uses of ultrasound in medicine and industry.",
    [2019, 2020, 2023],
  ),
  createQuestion(
    "phy-05",
    "class-10-physics",
    "phy-ch-12",
    "Chapter 12: Geometrical Optics",
    "State the laws of refraction and derive the relation between refractive index and speed of light.",
    [2019, 2021, 2022, 2023],
  ),
  createQuestion(
    "phy-06",
    "class-10-physics",
    "phy-ch-12",
    "Chapter 12: Geometrical Optics",
    "Draw a ray diagram for image formation by a convex lens when the object is beyond 2F.",
    [2020, 2021, 2023],
  ),
  createQuestion(
    "phy-07",
    "class-10-physics",
    "phy-ch-13",
    "Chapter 13: Electrostatics",
    "Explain Coulomb's law and solve a numerical problem involving two point charges.",
    [2019, 2020, 2022, 2023],
  ),
  createQuestion(
    "phy-08",
    "class-10-physics",
    "phy-ch-13",
    "Chapter 13: Electrostatics",
    "Define electric field intensity and describe electric lines of force.",
    [2020, 2022],
  ),
  createQuestion(
    "phy-09",
    "class-10-physics",
    "phy-ch-14",
    "Chapter 14: Current Electricity",
    "State Ohm's law and explain its experimental verification using a circuit diagram.",
    [2019, 2020, 2021, 2022, 2023],
  ),
  createQuestion(
    "phy-10",
    "class-10-physics",
    "phy-ch-14",
    "Chapter 14: Current Electricity",
    "Compare series and parallel combinations of resistors and calculate equivalent resistance.",
    [2019, 2021, 2023],
  ),
  createQuestion(
    "phy-11",
    "class-10-physics",
    "phy-ch-15",
    "Chapter 15: Electromagnetism",
    "Describe the working principle of an electric motor with a labelled diagram.",
    [2020, 2021, 2022, 2023],
  ),
  createQuestion(
    "phy-12",
    "class-10-physics",
    "phy-ch-15",
    "Chapter 15: Electromagnetism",
    "Explain electromagnetic induction and state Faraday's law.",
    [2019, 2021, 2022],
  ),
  createQuestion(
    "phy-13",
    "class-10-physics",
    "phy-ch-16",
    "Chapter 16: Basic Electronics",
    "What is a diode? Explain forward and reverse biasing with circuit diagrams.",
    [2019, 2020, 2022],
  ),
  createQuestion(
    "phy-14",
    "class-10-physics",
    "phy-ch-16",
    "Chapter 16: Basic Electronics",
    "Describe the action of a transistor as a switch.",
    [2020, 2023],
  ),
  createQuestion(
    "phy-15",
    "class-10-physics",
    "phy-ch-16",
    "Chapter 16: Basic Electronics",
    "Write short notes on digital and analogue signals.",
    [2021, 2022],
  ),

  createQuestion(
    "chem-01",
    "class-10-chemistry",
    "chem-ch-9",
    "Chapter 9: Chemical Equilibrium",
    "State Le Chatelier's principle and explain the effect of temperature and pressure on equilibrium.",
    [2019, 2020, 2021, 2022, 2023],
  ),
  createQuestion(
    "chem-02",
    "class-10-chemistry",
    "chem-ch-9",
    "Chapter 9: Chemical Equilibrium",
    "Differentiate between reversible and irreversible reactions with examples.",
    [2019, 2021, 2023],
  ),
  createQuestion(
    "chem-03",
    "class-10-chemistry",
    "chem-ch-10",
    "Chapter 10: Acids, Bases and Salts",
    "Define acids and bases according to Arrhenius and Bronsted-Lowry concepts.",
    [2019, 2020, 2022, 2023],
  ),
  createQuestion(
    "chem-04",
    "class-10-chemistry",
    "chem-ch-10",
    "Chapter 10: Acids, Bases and Salts",
    "Explain pH scale and calculate pH for a given hydrogen ion concentration.",
    [2020, 2021, 2022],
  ),
  createQuestion(
    "chem-05",
    "class-10-chemistry",
    "chem-ch-11",
    "Chapter 11: Organic Chemistry",
    "What are hydrocarbons? Explain saturated and unsaturated hydrocarbons.",
    [2019, 2020, 2021, 2023],
  ),
  createQuestion(
    "chem-06",
    "class-10-chemistry",
    "chem-ch-11",
    "Chapter 11: Organic Chemistry",
    "Write preparation and uses of methane.",
    [2021, 2022],
  ),
  createQuestion(
    "chem-07",
    "class-10-chemistry",
    "chem-ch-12",
    "Chapter 12: Hydrocarbons",
    "Describe addition reactions of alkenes with hydrogen and halogens.",
    [2019, 2021, 2022, 2023],
  ),
  createQuestion(
    "chem-08",
    "class-10-chemistry",
    "chem-ch-12",
    "Chapter 12: Hydrocarbons",
    "Compare alkanes, alkenes, and alkynes in terms of bonding and reactivity.",
    [2020, 2022, 2023],
  ),
  createQuestion(
    "chem-09",
    "class-10-chemistry",
    "chem-ch-13",
    "Chapter 13: Biochemistry",
    "Explain carbohydrates and their importance in living organisms.",
    [2019, 2020, 2023],
  ),
  createQuestion(
    "chem-10",
    "class-10-chemistry",
    "chem-ch-13",
    "Chapter 13: Biochemistry",
    "Write the functions of proteins and enzymes.",
    [2020, 2021],
  ),
  createQuestion(
    "chem-11",
    "class-10-chemistry",
    "chem-ch-14",
    "Chapter 14: The Atmosphere",
    "Discuss the causes and effects of acid rain.",
    [2019, 2021, 2022],
  ),
  createQuestion(
    "chem-12",
    "class-10-chemistry",
    "chem-ch-14",
    "Chapter 14: The Atmosphere",
    "Explain ozone layer depletion and its harmful effects.",
    [2020, 2021, 2022, 2023],
  ),

  createQuestion(
    "math-01",
    "class-10-mathematics",
    "math-ch-1",
    "Chapter 1: Quadratic Equations",
    "Solve a quadratic equation by completing the square and verify the roots.",
    [2019, 2020, 2021, 2022, 2023],
  ),
  createQuestion(
    "math-02",
    "class-10-mathematics",
    "math-ch-1",
    "Chapter 1: Quadratic Equations",
    "Find the nature of roots using the discriminant.",
    [2019, 2021, 2023],
  ),
  createQuestion(
    "math-03",
    "class-10-mathematics",
    "math-ch-2",
    "Chapter 2: Theory of Quadratic Equations",
    "Form a quadratic equation when the sum and product of roots are given.",
    [2020, 2021, 2022, 2023],
  ),
  createQuestion(
    "math-04",
    "class-10-mathematics",
    "math-ch-2",
    "Chapter 2: Theory of Quadratic Equations",
    "Prove the relationship between roots and coefficients of a quadratic equation.",
    [2019, 2022],
  ),
  createQuestion(
    "math-05",
    "class-10-mathematics",
    "math-ch-3",
    "Chapter 3: Variations",
    "Solve problems involving direct and inverse variation.",
    [2019, 2020, 2022, 2023],
  ),
  createQuestion(
    "math-06",
    "class-10-mathematics",
    "math-ch-3",
    "Chapter 3: Variations",
    "Define joint variation and solve a numerical example.",
    [2020, 2021],
  ),
  createQuestion(
    "math-07",
    "class-10-mathematics",
    "math-ch-4",
    "Chapter 4: Partial Fractions",
    "Resolve a rational expression into partial fractions with distinct linear factors.",
    [2019, 2020, 2021, 2023],
  ),
  createQuestion(
    "math-08",
    "class-10-mathematics",
    "math-ch-4",
    "Chapter 4: Partial Fractions",
    "Resolve partial fractions when the denominator has repeated factors.",
    [2021, 2022, 2023],
  ),
  createQuestion(
    "math-09",
    "class-10-mathematics",
    "math-ch-5",
    "Chapter 5: Sets and Functions",
    "Find domain and range of a given function.",
    [2019, 2020, 2022],
  ),
  createQuestion(
    "math-10",
    "class-10-mathematics",
    "math-ch-5",
    "Chapter 5: Sets and Functions",
    "Determine whether a relation is a function using ordered pairs.",
    [2020, 2023],
  ),
];

export const questionYears = [2019, 2020, 2021, 2022, 2023];
