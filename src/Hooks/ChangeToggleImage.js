import { useState } from "react";

const ChangeToggleImage = (toggleSource, onSource) => {
  const [imageSource1, setImageSource1] = useState(toggleSource);
  const [imageSource2, setImageSource2] = useState(toggleSource);
  const [imageSource3, setImageSource3] = useState(toggleSource);
  const [imageSource4, setImageSource4] = useState(toggleSource);
  const [imageSource5, setImageSource5] = useState(toggleSource);
  const [imageSource6, setImageSource6] = useState(toggleSource);
  const [imageSource7, setImageSource7] = useState(toggleSource);
  const [imageSource8, setImageSource8] = useState(toggleSource);
  const [imageSource9, setImageSource9] = useState(toggleSource);
  const [imageSource10, setImageSource10] = useState(toggleSource);
  const [imageSource11, setImageSource11] = useState(toggleSource);

  const switchImage = (setImageSource, currentSource) => {
    setImageSource(currentSource === toggleSource ? onSource : toggleSource);
  };

  const switchImage1 = () => switchImage(setImageSource1, imageSource1);
  const switchImage2 = () => switchImage(setImageSource2, imageSource2);
  const switchImage3 = () => switchImage(setImageSource3, imageSource3);
  const switchImage4 = () => switchImage(setImageSource4, imageSource4);
  const switchImage5 = () => switchImage(setImageSource5, imageSource5);
  const switchImage6 = () => switchImage(setImageSource6, imageSource6);
  const switchImage7 = () => switchImage(setImageSource7, imageSource7);
  const switchImage8 = () => switchImage(setImageSource8, imageSource8);
  const switchImage9 = () => switchImage(setImageSource9, imageSource9);
  const switchImage10 = () => switchImage(setImageSource10, imageSource10);
  const switchImage11 = () => switchImage(setImageSource11, imageSource11);

  return {
    imageSource1,
    imageSource2,
    imageSource3,
    imageSource4,
    imageSource5,
    imageSource6,
    imageSource7,
    imageSource8,
    imageSource9,
    imageSource10,
    imageSource11,
    switchImage1,
    switchImage2,
    switchImage3,
    switchImage4,
    switchImage5,
    switchImage6,
    switchImage7,
    switchImage8,
    switchImage9,
    switchImage10,
    switchImage11,
  };
};

export default ChangeToggleImage;
