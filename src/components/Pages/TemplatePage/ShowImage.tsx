import React from "react";
import { DivWrapper, ContentDiv, CloseDiv } from "./TemplatePage.styles";

interface ShowImageProps {
  src: string;
  ind: number;
  setremoveImage: (index: number) => void;
  alt?: string;
}

export const ShowImage: React.FC<ShowImageProps> = ({ src, ind, setremoveImage, alt }) => {
  const removeImage = (index: number) => setremoveImage(index);

  return (
    <DivWrapper>
      <ContentDiv>
        <img width={150} src={src} alt={alt ?? "Hashbuzz.social"} />
        <CloseDiv onClick={() => removeImage(ind)}>X</CloseDiv>
      </ContentDiv>
    </DivWrapper>
  );
};
