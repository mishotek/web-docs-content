const isValidKeyValue = ([key, value]) => key && value;

const toKeyValue = line => line.split(':');

const keyValueToJson = ([key, value]) => {
  const valueShouldBeList = value.includes('- ');
  if (valueShouldBeList) {
    return {
      [key.trim()]: value
        .split('- ')
        .map(val => val.trim())
    };
  }

  return {[key.trim()]: value.trim()};
};

const joinObjectsReducer = (obj1, obj2) => ({...obj1, ...obj2});

// TODO handle tag property
exports.markdownReader = (str) => {
  const json = str
    .split(/(\r\n|\n|\r)/)
    .map(toKeyValue)
    .filter(isValidKeyValue)
    .map(keyValueToJson)
    .reduce(joinObjectsReducer, {});

  return {
    title: json.title || '',
    slug: json.slug || '',
  };
};
