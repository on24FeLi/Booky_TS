import { renderNavbar } from './navbar';
const OPEN_BTN = document.getElementById("openFormBtn") as HTMLButtonElement;
const FORM_BOX = document.getElementById("floatingForm") as HTMLFormElement;
const OPEN_FILTER_BTN = document.getElementById("openFilterBtn") as HTMLButtonElement;
const FORM_FILTER_BTN = document.getElementById("filterPopup") as HTMLDivElement;
OPEN_BTN.addEventListener("click", (e) => {
  e.preventDefault();
  FORM_BOX.classList.toggle("hidden");
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    FORM_BOX.classList.add("hidden");
  }
});
// Öffnen & Schließen des Filtermenüs
OPEN_FILTER_BTN.addEventListener("click", (e) => {
  e.preventDefault();
  FORM_FILTER_BTN.classList.toggle("hidden");
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    FORM_FILTER_BTN.classList.add("hidden");
  }
});
//---
document.addEventListener("DOMContentLoaded", () => {
  const WISH_LIST_FORM_EL = document.querySelector("#floatingForm") as HTMLFormElement;
  const WISH_LIST_FORM_NAME_EL = document.querySelector("#book_Name") as HTMLInputElement;
  const WISH_LIST_FORM_PREIS_EL = document.querySelector("#bookPreis") as HTMLInputElement;
  const WISH_LIST_FORM_ERSCHEINUNGSDATUM_EL = document.querySelector("#bookPublish") as HTMLInputElement;
  const WISHLIST_EL = document.querySelector("#wishlist") as HTMLUListElement;
  const WISH_FORM = document.querySelector("#wishForm") as HTMLFormElement;
  const STORED_LIST = localStorage.getItem("wishList");
  const GENRE_SELECT = document.getElementById("genreSelect")as HTMLSelectElement;
  const SORT_SELECT = document.getElementById("sortSelect") as HTMLSelectElement;
  const APPLY_FILTER_BTN = document.getElementById("applyFilterBtn") as HTMLButtonElement;
 
  interface WishItem {
  bookName: string;
  genres: string[];
  isDone: boolean;
  bookPrice: number;
  bookPublishDate:string;
  }
  let wishList: Array<WishItem> = [];
  WISH_LIST_FORM_EL.addEventListener("submit", processWishListSubmission);
  //Sachen aus dem Local Storage holen
  if (STORED_LIST) {
    wishList = JSON.parse(STORED_LIST);
    renderWishList();
    showUpcomingBooksPopup();
  }
  function processWishListSubmission(e: Event) {
    e.preventDefault();
    let bookName = WISH_LIST_FORM_NAME_EL.value;
    let bookPrice = parseFloat(WISH_LIST_FORM_PREIS_EL.value) || 0;
    let bookPublishDate = WISH_LIST_FORM_ERSCHEINUNGSDATUM_EL.value;

    const CHECKED_GENRES = Array.from(
        document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked')
      ).map((checkbox) => checkbox.nextElementSibling?.textContent?.trim()?? "");
    const WISH_LIST_ITEM = {
      bookName: bookName,
      bookPrice: bookPrice,
      bookPublishDate: bookPublishDate,
      genres: CHECKED_GENRES,
      isDone: false,
    };
    wishList.push(WISH_LIST_ITEM);
    saveToLocalStorage();
    renderWishList();
    WISH_FORM.reset();
    FORM_BOX.classList.add("hidden");
  }
  function saveToLocalStorage() {
    localStorage.setItem("wishList", JSON.stringify(wishList));
  }

  function renderWishList(filteredList = wishList) : void{
    //Reset
    WISHLIST_EL.innerHTML = "";
    //fill
    filteredList.forEach((WISH_LIST_ITEM, index) => {
        (document.getElementById("totalCount") as HTMLElement).innerText = `Total: ${wishList.length}`;
      let totalPrice = filteredList.reduce(
        (sum, book) => sum + book.bookPrice,
        0
      );
      (document.getElementById("totalPrice") as HTMLElement).innerText = `Preis: ${totalPrice.toFixed(2)}€`;
      const LI_WISH_ELEMENT = document.createElement("LI");
      LI_WISH_ELEMENT.innerHTML = `
        <div class="book-row">
        <div class="book-title">${WISH_LIST_ITEM.bookName}</div>
        <div class="book-price">${WISH_LIST_ITEM.bookPrice + "€"}</div>
      <div class="book-publish">
      ${
        new Date(WISH_LIST_ITEM.bookPublishDate) < new Date()
          ? '<img src="./public/DatumInVergangenheit.png" alt="vergangen" title="Bereits erschienen" style="height: 16px; margin-left: 5px;" />'
          : new Date(WISH_LIST_ITEM.bookPublishDate).toLocaleDateString("de-DE")
      }
        </div>
        <button class="delete-btn" data-index="${index}">
        <img src="./public/delete.png" alt="">
        </button>
        </div>`;
      if (index % 2 === 0) {
        LI_WISH_ELEMENT.classList.add("light-bg");
      } else {
        LI_WISH_ELEMENT.classList.add("lightdark-bg");
      }
      WISHLIST_EL.appendChild(LI_WISH_ELEMENT);
    });
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const target = e.currentTarget as HTMLButtonElement;
        const INDEX_TO_DELETE = Number(target.getAttribute("data-index"));
        wishList.splice(INDEX_TO_DELETE, 1);
        saveToLocalStorage(); // Speichern
        renderWishList(); // Neu rendern
      });
    });
  }
  const SEARCH_INPUT = document.getElementById("searchInput") as HTMLInputElement;

  SEARCH_INPUT.addEventListener("input", () => {
    const SEARCH_TERM = SEARCH_INPUT.value.toLowerCase();
    const FILTERED_BOOKS = wishList.filter((wishList) =>
      wishList.bookName.toLowerCase().includes(SEARCH_TERM)
    );
    console.log(FILTERED_BOOKS);
    renderWishList(FILTERED_BOOKS);
  });
  APPLY_FILTER_BTN.addEventListener("click", () => {
    const SELECTED_GENRE = GENRE_SELECT.value;
    const SELECTED_SORT = SORT_SELECT.value;

    let FILTERED_BOOKS = [...wishList];
    if (SELECTED_GENRE !== "") {
      FILTERED_BOOKS = FILTERED_BOOKS.filter((book) =>
        book.genres.includes(SELECTED_GENRE)
      );
    }
    if (SELECTED_SORT === "az") {
      FILTERED_BOOKS.sort((a, b) =>
        a.bookName.localeCompare(b.bookName, "de", { sensitivity: "base" })
      );
    } else if (SELECTED_SORT === "za") {
      FILTERED_BOOKS.sort((a, b) =>
        b.bookName.localeCompare(a.bookName, "de", { sensitivity: "base" })
      );
    } else if (SELECTED_SORT === "price-asc") {
      FILTERED_BOOKS.sort((a, b) => a.bookPrice - b.bookPrice);
    } else if (SELECTED_SORT === "price-desc") {
      FILTERED_BOOKS.sort((a, b) => b.bookPrice - a.bookPrice);
    } else if (SELECTED_SORT === "date-asc") {
      FILTERED_BOOKS.sort(
        (a, b) => new Date(a.bookPublishDate).getTime() - new Date(b.bookPublishDate).getTime()
      );
    } else if (SELECTED_SORT === "date-desc") {
      FILTERED_BOOKS.sort(
        (a, b) => new Date(b.bookPublishDate).getTime() - new Date(a.bookPublishDate).getTime()
      );
    }
    renderWishList(FILTERED_BOOKS);
  });
  function showUpcomingBooksPopup() {
    const TODAY = new Date();
    const NEXT_WEEK = new Date();
    NEXT_WEEK.setDate(TODAY.getDate() + 7);

    const UPCOMING_BOOKS = wishList.filter((book) => {
      const PUB_DATE = new Date(book.bookPublishDate);
      return PUB_DATE >= TODAY && PUB_DATE <= NEXT_WEEK;
    });

    if (UPCOMING_BOOKS.length > 0) {
        const POPUP_LIST = document.getElementById("popupBookList") as HTMLUListElement;
        POPUP_LIST.innerHTML = "";

      UPCOMING_BOOKS.forEach((book) => {
        const PUB_DATE = new Date(book.bookPublishDate);
        const DIFF_TIME = PUB_DATE.getTime() - TODAY.getTime();
        const DIFF_DAYS = Math.ceil(DIFF_TIME / (1000 * 60 * 60 * 24));

        const li = document.createElement("li");
        li.textContent = `${book.bookName} – erscheint in ${DIFF_DAYS} Tag${
          DIFF_DAYS === 1 ? "" : "en"
        }`;
        POPUP_LIST.appendChild(li);
      });

      document.getElementById("weekPopup")?.classList.remove("hidden");
    }
  }
  renderNavbar();
});