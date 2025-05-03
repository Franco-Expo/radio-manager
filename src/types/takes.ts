
export interface Song {
  id: string;
  title: string;
  artist?: string; // Added artist field as optional
  news: string;
}

export interface Take {
  id: string;
  number: number;
  date: Date;  // Modificato da opzionale a obbligatorio
  songs: Song[];
}
