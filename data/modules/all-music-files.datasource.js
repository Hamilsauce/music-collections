import { SOURCE_URLS } from '../metadata.js'
import { DataAccessor } from '../DataAccessor.js'



// export default (await (await fetch('./_sources/ALL_MUSIC_FILES.data.json')).json())
// export default (await (await fetch('./_sources/ALL_MUSIC_FILES.data.json'))).json();
export default ((await (await fetch('./_sources/_MUFO_EXTRACTED.json'))).json());
  
