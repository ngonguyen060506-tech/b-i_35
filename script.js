// 1. Mảng dữ liệu sản phẩm (Mỗi sản phẩm đều có thuộc tính image chứa link ảnh)
const products = [
    { 
        id: 1, 
        name: "Laptop Dell XPS 13", 
        price: 28500000, 
        desc: "Màn hình tràn viền InfinityEdge, chip Intel Core i7 thế hệ mới.",
        image: "https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600"
    },
    { 
        id: 2, 
        name: "iPhone 15 Pro Max", 
        price: 32900000, 
        desc: "Khung viền Titan siêu nhẹ, camera zoom quang học 5x.",
        image: "https://images.pexels.com/photos/18525574/pexels-photo-18525574.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    { 
        id: 3, 
        name: "Tai nghe Sony WH-1000XM5", 
        price: 7490000, 
        desc: "Chống ồn chủ động hàng đầu, thời lượng pin lên đến 30 giờ.",
        image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    { 
        id: 4, 
        name: "Bàn phím cơ Keychron K2", 
        price: 1850000, 
        desc: "Kết nối không dây Bluetooth 5.1, tương thích tốt Mac và Windows.",
        image: "https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    { 
        id: 5, 
        name: "Chuột Logitech MX Master 3S", 
        price: 2490000, 
        desc: "Thiết kế công thái học ôm tay, con lăn điện từ MagSpeed.",
        image: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    { 
        id: 6, 
        name: "iPad Air M2 11 inch", 
        price: 16990000, 
        desc: "Hiệu năng mạnh mẽ với chip Apple M2, hỗ trợ Apple Pencil Pro.",
        image: "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
];

const productListEl = document.getElementById("productList");
const searchInputEl = document.getElementById("searchInput");
const errorMessageEl = document.getElementById("errorMessage");

const formatCurrency = (amount) => amount.toLocaleString("vi-VN") + " ₫";

// Ảnh SVG dự phòng nội bộ (hiển thị ngay cả khi mất kết nối mạng)
const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250">
        <rect width="400" height="250" fill="#dfe6e9"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#636e72">
            Ảnh sản phẩm
        </text>
    </svg>
`);

// 2. Hàm hiển thị sản phẩm kèm hình ảnh
function renderProducts(items, keyword = "") {
    productListEl.innerHTML = "";

    if (items.length === 0) {
        errorMessageEl.textContent = `Không tìm thấy sản phẩm nào khớp với từ khóa "${keyword}".`;
        errorMessageEl.classList.remove("hidden");
        return;
    }

    errorMessageEl.classList.add("hidden");

    items.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        // Tạo khung chứa ảnh và thẻ <img>
        const imgWrapper = document.createElement("div");
        imgWrapper.className = "image-wrapper";

        const img = document.createElement("img");
        img.className = "product-image";
        img.src = product.image;
        img.alt = product.name;
        img.onerror = function() {
            this.onerror = null; // Tránh lặp vô hạn
            this.src = FALLBACK_IMAGE;
        };

        imgWrapper.appendChild(img);

        // Tạo phần thông tin chữ
        const info = document.createElement("div");
        info.className = "product-info";

        const title = document.createElement("h3");
        title.className = "product-title";
        title.textContent = product.name;

        const desc = document.createElement("p");
        desc.className = "product-desc";
        desc.textContent = product.desc;

        const price = document.createElement("div");
        price.className = "product-price";
        price.textContent = formatCurrency(product.price);

        info.appendChild(title);
        info.appendChild(desc);
        info.appendChild(price);

        card.appendChild(imgWrapper);
        card.appendChild(info);
        productListEl.appendChild(card);
    });
}

// 3. Hàm xử lý tìm kiếm
function handleSearch(event) {
    const rawKeyword = event.target.value;
    const normalizedKeyword = rawKeyword.trim().toLowerCase();

    if (normalizedKeyword === "") {
        renderProducts(products);
        return;
    }

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(normalizedKeyword)
    );

    // Sắp xếp ưu tiên: khớp đầu tên lên trước, khớp giữa tên xếp sau
    filteredProducts.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        const startsA = nameA.startsWith(normalizedKeyword);
        const startsB = nameB.startsWith(normalizedKeyword);

        if (startsA && !startsB) return -1;
        if (!startsA && startsB) return 1;

        return nameA.indexOf(normalizedKeyword) - nameB.indexOf(normalizedKeyword);
    });

    renderProducts(filteredProducts, rawKeyword.trim());
}

searchInputEl.addEventListener("input", handleSearch);
renderProducts(products);