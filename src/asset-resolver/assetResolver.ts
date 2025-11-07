import FlyLeavingBox from "./assets/flyLeavesEmptyBox.png";

export function assetResolver(image: "FlyLeavingBox") {
  const imageMapper = {
    FlyLeavingBox,
  };

  return imageMapper[image];
}
