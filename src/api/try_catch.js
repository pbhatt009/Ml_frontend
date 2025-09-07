const try_catch = async(func) => {

    try {
        const res = await func();
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
        
        
    }
   
}
export default try_catch;