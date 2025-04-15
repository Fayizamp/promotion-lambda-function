import connectDB from '../dbMapping/DBconnect.js';
import responseHandler from "../helpers/responseHandler.js";
import productSchema from "../models/productModel.js";


export default async function handler(req, res){
    const {projectName} = req.method == "GET" ? req.query : req.body;

    if(!projectName){
        return responseHandler(res,400,"projectName required");
    }
    try {
        const conn = await connectDB(projectName);
        const Product = conn.models.Product || conn.model("Product", productSchema);

        if(req.method === "POST"){
            const product = await Product.create(req.body);
            return responseHandler( res,201," preduct created successfully", product )
        }
        else if(req.method === 'GET'){
            const product = await Product.find();
            return responseHandler(res, 200, "product fetched successfully", product)
        }
        else if(req.method === 'PUT'){
            const {_id,...upData} = req.body;
            if (!_id) return responseHandler(res, 400, "Product id is required");
            const upProduct = await Product.findByIdAndUpdate(_id,upData, {new: true});
            return responseHandler(res, 200, "product updated successfully", upProduct)

        }
        else if (req.method === "DELETE") {
            const { _id } = req.body;
            if (!_id) return responseHandler(res, 400, "Product _id is required")
            const delProduct = await Product.findByIdAndDelete(_id)
            return responseHandler(res, 200, "Product deleted", delProduct);
          }

          else{
            return responseHandler(res, 405, "Method not allowed")
          }
    } catch (error) {
        return responseHandler(res, 500, `Server error: ${error.message}`)
    }

}