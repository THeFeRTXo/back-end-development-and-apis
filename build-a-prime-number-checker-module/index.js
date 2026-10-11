
function isPrime(number){
    if(number <= 1){
        console.log("Please put a numer greater than 1.")
        return false
    }
    
    var squaredRoot = Math.trunc(Math.sqrt(number))

    for(let i = 2; i <= squaredRoot; i++){
        if(number % i == 0) return false
    }

    return true
};

module.exports = {
    isPrime,
};
    

