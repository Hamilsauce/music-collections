import { SOURCE_URLS } from '../metadata.js'
import { DataAccessor } from '../DataAccessor.js'


export default (await (await fetch(SOURCE_URLS.FILE_DATA))).json()
