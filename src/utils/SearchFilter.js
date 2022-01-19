/**
 * Checks if string a exist in string b as a stand alone word.
 * @param {Search value} a 
 * @param {Target value} b 
 * @returns true if a substring of b otherwise false.
 */
function SearchFilter(a,b)
{
    if( a === b)
        return true;
    if(a.length > b.length )
        return false;
    for(let i = 0; i < a.length; i++)
        if( a[i] != b[i] )
            return false;
    return true;
}



module.exports = SearchFilter;