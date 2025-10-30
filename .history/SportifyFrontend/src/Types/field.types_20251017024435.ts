// Định nghĩa các interface dùng chung
export interface Location {
  latitude: number;
  longitude: number;
}

export interface Field {
  fieldid: number;
  namefield: string;
  address: string;
  location?: Location;
  distance?: number | null;
  // Các trường khác
  price: number;
  image: string;
  descriptionfield: string;
  sporttypeid: string;
  status: boolean;
  latitude?: number | null;
  longitude?: number | null;
  sporttype?: { sporttypeid: string; categoryname: string };
}