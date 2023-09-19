// setup() takes in a 2D array where each row holds two friends. Returns an object for each
// person that contains a list of their friends.
function setup (arr)
{
    var friends = {};

    if (arr.length === 0)
    {
        return friends;
    }

    // Accessing each person.
    arr.forEach((_, ind) => arr[ind].forEach((ele, i) =>
    {
        // If an object for this person doesn't exist, make one.
        if (friends[ele] === undefined)
            friends[ele] = new Array();

        // If this is the 1st person, add the second person to their list. Else, vice versa.
        i === 0 ? friends[ele].push(arr[ind][i+1])
                : friends[ele].push(arr[ind][i-1]);
    }));

    return friends;
}

// mapper() takes in an object of objects with each key representing a person, and each value that
// person's list of friends. Returns a new array of objects where each key represents a pair of
// friends and the value is a list of either of their friends.
function mapper(setup_arr)
{
    var arr = [];

    if (setup_arr.length === 0)
        return arr;

    for (let key in setup_arr)
        setup_arr[key].forEach(ele =>
        {
            var obj = {};
            // Use the current person (key) and their friend (ele) to create a 'pair of friends'
            // and then create an object using the person's friend list.
            key < ele ? obj[key.concat(ele)] = setup_arr[key]
                      : obj[ele.concat(key)] = setup_arr[key];
            arr.push(obj);
        });

    return arr;
}

// group() takes in an array of objects where each key is a pair of friends and the value is a
// list of friends that either of them have. Returns a shortened array where matching keys from
// input had their lists grouped into one object.
function group(mapped_arr)
{
    var obj = {};
    var keys = [];
    var checkmap = [];

    if (mapped_arr.length === 0)
        return obj;

    // Create an array of keys
    mapped_arr.forEach((_, ind) =>
    {
        for (let key in mapped_arr[ind])
            keys.push(key)
    });

    // Store false in a boolean array for each key
    keys.forEach((_, ind) => checkmap.push(false));

    for (var i = 0; i < keys.length; i++)
        for (var j = i; j < keys.length; j++)
        {
            // If this key has not had an object created for it already, checkmap will read false
            if (checkmap[i] === false)
            {
                obj[keys[i]] = new Array();
                obj[keys[i]].push(mapped_arr[i][keys[i]]);
                checkmap[i] = true;
            }

            if (checkmap[j] === false)
            {
                // Only change checkmap[j] to true if it's a duplicate key. If it's not, the key
                // will get checked later by the outer loop and all keys will be compared.
                if (keys[j] === keys[i])
                {
                    obj[keys[i]].push(mapped_arr[j][keys[j]]);
                    checkmap[j] = true;
                }
            }
        }


    return obj;
}

// reducer() takes in an object of objects where each key is a pair of friends and their value 2D
// array that holds lists of either friend's friends. Returns a simplified object of objects where
// the 2D array is reduced to a 1D array containing only mutual friends between the pair.
function reducer(grouped_obj)
{
    if (grouped_obj.length === 0)
        return grouped_obj;

    // grouped_obj -> object holding keys and values
    // grouped_obj[key] -> multi-dimensional array value of specific key
    // grouped_obj[key][i] -> array within multi-dimensional array
    // grouped_obj[key][i][j] -> element within array

    // findMatches() takes in a 2D array of separate lists of friends and returns a 1D array
    // containing only friends that appeared in multiple lists.
    function findMatches(arr)
    {
        var friends = new Array();
        var checkmap = {};

        // Creating an object for each friend and defaulting the value to false.
        arr.forEach((_, ind) => arr[ind].forEach(ele =>
        {
            checkmap[ele] = false;
        }));

        // Every friend in the first list will be checked against every friend in the second list.
        // If a friend matches, check if they've already been inserted.
        for (var i = 0; i < arr.length; i++)
            if (i < arr.length - 1)
                for (var j = 0; j < arr[i].length; j++)
                    for (var k = 0; k < arr[i+1].length; k++)
                        if (arr[i][j] === arr[i+1][k])
                            if (checkmap[arr[i][j]] === false)
                            {
                                friends.push(arr[i][j]);
                                checkmap[arr[i][j]] = true;
                            }

        return friends;
    }

    for (let key in grouped_obj)
        grouped_obj[key] = findMatches(grouped_obj[key]);

    return grouped_obj;
}

// mapReduce() takes in a 2D array where each row represents a pair of friends. Returns an object
// objects where each key is a pair of friends and the value is a list of their mutual friends.
function mapReduce(friends)
{
    return reducer(group(mapper(setup(friends))));
}
