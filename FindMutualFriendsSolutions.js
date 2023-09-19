function setup (arr){
    var friends = {};
    arr.forEach(x =>{
        var friend1 = x[0];
        var friend2 = x[1];
        if (friend1 in friends)
            friends[friend1].push(friend2);
        else
            friends[friend1] = [friend2];

        if (friend2 in friends)
            friends[friend2].push(friend1);
        else
            friends[friend2] = [friend1];
    });
    return friends;
    // returns an object {man : [friends]}
}

function mapper (setup_arr){
    var arr = [];
    for(x in setup_arr){
        setup_arr[x].forEach(i => {
            var key = x > i ? i + x : x + i; // Create Sorted Key
            var temp = new Object; // Create object
            temp[key] = Array.from(setup_arr[x]);  // Assign copy of array
            arr.push(temp); // add object to the final array assigned to arr
        });
    }
    return arr;
    // return an array of object [{(man,friend_i) : [Friends]}]
}

function group (mapped_arr) {
    var obj = {}
    mapped_arr.forEach(x => {
        var key = Object.keys(x)[0]; // assign person
        if (key in obj){
            // push all elements of x[key] into obj[key]
            obj[key].push(Array.from(x[key]));
        }
        else {
            // Assign copy of the array to the object with key
            obj[key] = [Array.from(x[key])];
        }
    })
    return obj;
    // return an object {(man,friend): [Friends]}
}

function reducer (grouped_obj) {
    for (x in grouped_obj){
        var arr1 = grouped_obj[x][0];
        var arr2 = grouped_obj[x][1];
        grouped_obj[x] = arr1.filter(i => arr2.indexOf(i) !== -1
            && x.charAt(0) !== i
            && x.charAt(1) !== i
        )
        // take intersection of the two
    }
    return grouped_obj;
    // return an object {(man,friend): [Friends]}

}

function mapreduce (friends) {
    var initial = setup(friends);
    var mapped = mapper(initial);
    var grouped = group(mapped);
    var reduced = reducer(grouped);
    return reduced;
}
