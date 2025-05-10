
export interface Song {
  id: string;
  title: string;
  artist?: string;
  news: string;
}

export interface Take {
  id: string;
  number: number;
  date: Date;
  publishDate?: Date | null;
  songs: Song[];
}
