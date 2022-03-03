const cTypesUrl = '../data/lists/contenttypes.json'
const { ContentType } = await (await fetch(cTypesUrl)).json()


const typeAggregates = (list) => {
  const aggr = list.reduce((acc, curr, i) => {
    return {
      ...acc,
      [curr]: acc[curr] ? acc[curr] + 1 : 1,
      unique: [...new Set([...acc.unique, curr])],
    }
  }, { totalCount: list.length, unique: [] });
  return aggr
};
// export const contentTypeList = aggro.unique
export default typeAggregates(ContentType);