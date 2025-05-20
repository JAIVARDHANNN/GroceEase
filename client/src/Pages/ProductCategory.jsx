import React from 'react'
import { useAppContext } from '../Context/AppContext'
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets';

const ProductCategory = () => {

    const {products} = useAppContext();
    const {category} = useParams();

    const searchCateogry  = categories.find((item)=> item.path.toLowerCase() === category)

    const filteredProducts = products.filter((product)=> product.category.toLowerCase() === category)

  return (
    <div className='mt-16'>
        {searchCateogry && (
            <div className='flex flex-col items-end w-max'>
               <p className='text-2xl font-medium' >{searchCateogry.text.toUpperCase()}</p>
               <div className='w-16 h-0.5 bg-primary rounded-full'></div>  
            </div>
        )}
        {filteredProducts.length > 0 ? (
          <div>
            {filteredProducts.map((product)=>(
              <ProductCard key={product._id} product= {product} />
            ))}
          </div>
        ): (
            <div></div>
        )}

    </div>
  )
}

export default ProductCategory