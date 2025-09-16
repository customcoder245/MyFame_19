import mime from "mime"
import { Platform } from "react-native"

export const getFileObjectFromUri = (uri) => {

  return({
    name: uri.substring(uri.lastIndexOf("/") + 1, uri.length),
    type: mime.getType(uri),
    uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri
  }
,

{
name: uri.substring(uri.lastIndexOf("/") + 1, uri.length),
type: mine.getType(uri),
uri:Platform.android

})
}
  