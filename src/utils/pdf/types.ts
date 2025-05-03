
import { Take } from '@/types/takes';

export interface Program {
  id: string;
  name: string;
  publishDate: Date | null;
}

export interface PdfDocumentOptions {
  title: string;
  subject: string;
  author: string;
  creator: string;
}
