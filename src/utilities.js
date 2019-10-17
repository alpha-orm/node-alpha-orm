function array_difference(array_1, array_2) {
    let a = []
    let difference = []

    for (let i = 0; i < array_1.length; i++) {
        a[array_1[i]] = true;
    }

    for (let i = 0; i < array_2.length; i++) {
        if (a[array_2[i]]) {
            delete a[array_2[i]];
        } else {
            a[array_2[i]] = true
        }
    }

    for (let k in a) {
        difference.push(k)
    }

    return difference
}

function get_type(value) {
    let type = typeof(value)
    if (type == 'number') {
        if (value == Math.round(value)) {
            return 'int'
        }
        return 'double'
    }
    return type
}

function is_object_empty(object) { return (Object.keys(object).length === 0 && object.constructor === Object) }

module.exports = { array_difference, get_type, is_object_empty }