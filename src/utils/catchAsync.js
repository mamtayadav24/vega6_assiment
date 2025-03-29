module.exports = (passedFunction) => (req, res, next) => {
    Promise.resolve(passedFunction(req, res, next)).catch((error) => {
      console.error(error);  
      next(error);           
    });
  };
  