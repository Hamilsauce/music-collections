//Create an array which will store our results
//`level` is a helper object to assist with search.
//It means that the result array is considered a reference in `level.result`
//so each iteration we build on top of `result`.
export const treeMaker = (paths) => {


  let result = [];
  let level = { result };
  // let paths;

  function reducer(accumulator, currentValue) {
    debugger;

    //If we already have an entry for this in the accumulator, we can just return it
    //Then, the next iteration of `currentValue` is known to be a child of this entry.
    if (accumulator[currentValue]) {
      return accumulator[currentValue];
    }

    // Otherwise, let's add this entry and then return it,
    // again the next iteration is going
    // to be a child of this entry.
    accumulator[currentValue] = {
      result: []
    };

    //Note: everything in the accumulator is eventually discarded - we only care about the `result` which we are
    //continuously building from the ground up using references.

    let el = {
      name: currentValue,
      children: accumulator[currentValue].result
    };

    //push the current element to `result`, which is equal to the precedening element (parents) children. (??)
    accumulator.result.push(el);

    //For the next iteration, the accumulator will be set to accumulator[currentValue]
    return accumulator[currentValue];
  };

  const tree = paths.forEach(path => {
    let pathParts = path.split('\\');
    // console.log('pathParts.reduce(reducer, level)', pathParts.reduce(reducer, level))
    //The accumulator will take the initial value of `level`
    pathParts.reduce(reducer, level)
  })



  // console.log({ tree })
  console.log({ result })
};

//result has been continuously built upon - using the reference in the initial `level`.
