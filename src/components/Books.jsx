import '../scss/components/Books.scss';
const Books = ({ dataset, categoryToTypeMap }) => {
  return (
    <>
      {dataset.map((book, i) => {
        return (
          <div className='item' key={`${book.title}${i}`}>
            <div className='picBox'>
              <div className='pic'>
                <img src={book.img} alt='' />
              </div>
            </div>
            <div className='title'>{book.title}</div>
            <div className='author'>作者：{book.author}</div>

            <div className='tagBox'>
              {book.categories.map((categories, j) => (
                <div className={`tag ${categoryToTypeMap.get(categories.main_category)}`} key={`${book.title}-${categories.sub_category}-${j}`}>
                  {categories.sub_category}
                </div>
              ))}
            </div>
            <button>查看詳情</button>
          </div>
        );
      })}
    </>
  );
};

export default Books;
