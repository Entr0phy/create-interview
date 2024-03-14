import { useState, useEffect } from "react";

function Product({ title, price, description, category, image }) {
  // todo: show product here
  return (
    <div className="p-2 border-2 rounded">
      <h1 className="text-center">{title}</h1>
      <h1 className="text-center">${price}</h1>
      <h1>{category}</h1>
      <img src={image} alt="image" className="h-24 w-24 object-contain" />
      <h1>{description}</h1>
    </div>
  );
}

export default function ProductList() {
  const [category, setCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [product, setProduct] = useState(null);
  const [productPage, setProductPage] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [sortCondition, setSortCondition] = useState({
    criteria: null,
    ascending: true,
  });

  const sortSearch = () => {
    if (sortCondition.criteria === "id") {
      fetch(
        `https://fakestoreapi.com/products?sort=${sortCondition.ascending ? "asc" : "desc"}`,
      )
        .then((res) => res.json())
        .then((json) => setProduct(json));
    } else if (sortCondition.criteria === "price") {
      fetch("https://fakestoreapi.com/products")
        .then((res) => res.json())
        .then((json) =>
          setProduct(
            json.sort(function (a, b) {
              if (sortCondition.ascending) return a.price - b.price;
              else return b.price - a.price;
            }),
          ),
        );
    }
  };

  const pageSize = 5; 

  useEffect(() => {
    setPage(1); // Reset to page 1 whenever products change
    setTotalPage(Math.ceil(product?.length / pageSize))
  }, [product]);

  useEffect(() => {
    if (product) {
      const newProductPage = product.slice(
        (page - 1) * pageSize,
        page * pageSize,
      );
      setProductPage(newProductPage); // Set the current page of products
    }
  }, [page, product]); // Depend on page and product, but NOT on productPage

  const sortSearchCategory = () => {
    if (sortCondition.criteria === "id") {
      fetch(
        `https://fakestoreapi.com/products/category/${selectedCategory}?sort=${sortCondition.ascending ? "asc" : "desc"}`,
      )
        .then((res) => res.json())
        .then((json) => setProduct(json));
    } else if (sortCondition.criteria === "price") {
      fetch(`https://fakestoreapi.com/products/category/${selectedCategory}`)
        .then((res) => res.json())
        .then((json) =>
          setProduct(
            json.sort(function (a, b) {
              if (sortCondition.ascending) return a.price - b.price;
              else return b.price - a.price;
            }),
          ),
        );
    }
  };

  function goToNextPage() {
    if (page < totalPage) {
      setPage((prev) => prev+1)
      
    }
  }
  
  function goToPreviousPage() {
    if (page > 1) {
      setPage((prev) => prev -1);
      // Fetch new page items and update the UI accordingly
    }
  }
  

  useEffect(() => {
    const getCategory = () =>
      fetch("https://fakestoreapi.com/products/categories")
        .then((res) => res.json())
        .then((json) => setCategory(json));

    const getProduct = () =>
      fetch("https://fakestoreapi.com/products?limit=5")
        .then((res) => res.json())
        .then((json) => setProduct(json));

    getCategory();
    getProduct();
  }, []);

  const getProductByCategory = () => {
    fetch(`https://fakestoreapi.com/products/category/${selectedCategory}`)
      .then((res) => res.json())
      .then((json) => setProduct(json));
  };
  return (
    <div className="flex flex-col max-w-6xl mx-auto justify-center items-center">
      <h1 className="font-bold m-2 text-bold">Product List</h1>

      {/* show category here */}
      <h1 className="font-bold">Select Category</h1>
      <h1 className="font-semibold">
        Current Selected Category:{" "}
        {!selectedCategory ? "None" : selectedCategory}
      </h1>
      <ul>
        {category?.map((item) => (
          <li key={item} onClick={() => setSelectedCategory(item)}>
            {item}
          </li>
        ))}
      </ul>
      <button
        className="font-semibold p-2 bg-orange-200 m-2"
        onClick={getProductByCategory}
        disabled={!selectedCategory}
      >
        Get Product By Category
      </button>

      <h1 className="font-bold">Sort Criteria</h1>
      <h1 className="font-bold">
        Selected Sort Criteria:{" "}
        {sortCondition.criteria ? sortCondition.criteria : "None"},{" "}
        {sortCondition.ascending ? "ascending" : "descending"}
      </h1>
      <ul>
        <li
          onClick={() =>
            setSortCondition((prev) => ({ ...prev, criteria: "id" }))
          }
        >
          ID
        </li>
        <li
          onClick={() =>
            setSortCondition((prev) => ({ ...prev, criteria: "price" }))
          }
        >
          Price
        </li>
        <li
          onClick={() =>
            setSortCondition((prev) => ({ ...prev, ascending: true }))
          }
        >
          Ascending
        </li>
        <li
          onClick={() =>
            setSortCondition((prev) => ({ ...prev, ascending: false }))
          }
        >
          Descending
        </li>
        <li
          onClick={() => setSortCondition({ criteria: null, ascending: true })}
        >
          None
        </li>
      </ul>

      <button
        className="font-semibold p-2 bg-orange-200 m-2"
        onClick={sortSearch}
        disabled={!sortCondition.criteria}
      >
        Search All Product by Sort
      </button>
      <button
        className="font-semibold p-2 bg-orange-200 m-2"
        onClick={sortSearchCategory}
        disabled={!sortCondition.criteria || !selectedCategory}
      >
        Search Product by Sort and selected Category
      </button>

      {/* show products here */}
      <ul>
        {productPage?.map((item) => (
          <li key={item.title}>
            {Product({
              title: item.title,
              price: item.price,
              description: item.description,
              category: item.category,
              image: item.image,
            })}
          </li>
        ))}
      </ul>
      <div className="flex flex-row m-2">
        <button className="mx-2" onClick={goToPreviousPage}>-</button>
        <h1>Page: {page}</h1>
        <button className="mx-2" onClick={goToNextPage}>+</button>
      </div>
    </div>
  );
}
