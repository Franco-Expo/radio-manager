
export type Song = {
  id: string;
  title: string;
  news: string;
};

export type Take = {
  id: string;
  number: number;
  songs: Song[];
};
