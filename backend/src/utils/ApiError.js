class ApiError extends Error {
  constructor(statusCode,message="Something went Wrong!",error=[],stack=""){
    super(message);
    this.statusCode=statusCode;
    this.error=error;
    this.stack=stack;
    this.data=null;
    this.message=message;
    this.success=false;
  }
}

export default ApiError;