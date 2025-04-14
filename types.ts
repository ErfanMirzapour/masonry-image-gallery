export interface Image {
   width: number;
   height: number;
   url: string;
}

export interface ImageGroup {
   '170x': Image;
   '236x': Image;

   '474x': Image;
   '736x': Image;
   orig: Image;
}

export interface ImageObject {
   description: string;
   images: ImageGroup;
}
