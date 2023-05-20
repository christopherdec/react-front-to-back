import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'
import { Link } from "react-router-dom";

function Explore() {
    return (
        <div className='explore'>
            <header>
                <p className='pageHeader'>Explore</p>
                <main>
                    <p className='exploreCategoryHeading'>Categories</p>
                    <div className='exploreCategories'>
                        <Link to='/category/rent'>
                            <img src={rentCategoryImage}
                                 alt='rent'
                                 className='exploreCategoryImg'
                            />
                            <p className='exploreCategoryName'>Places for rent</p>
                        </Link>
                        <Link to='/category/sale'>
                            <img src={sellCategoryImage}
                                 alt='sale'
                                 className='exploreCategoryImg'
                            />
                            <p className='exploreCategoryName'>Places for sale</p>
                        </Link>
                    </div>
                </main>
            </header>
        </div>
    )
}

export default Explore