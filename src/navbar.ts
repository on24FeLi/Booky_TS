export function renderNavbar():void {
    const href = window.location.href;
    const currentSite = href.split('/').pop();
  
    const navItems: { href: string; img: string; alt: string; page: string }[] = [
        { href: "#", img: "./public/bookjournal.png", alt: "Journal", page: "" },
        { href: "sublist.html", img: "./public/checkliste.png", alt: "Checkliste", page: "sublist.html" },
        { href: "wishlist.html", img: "./public/wish.png", alt: "Wunschliste", page: "wishlist.html" },
        { href: "statistik.html", img: "./public/statistik.png", alt: "Statistik", page: "statistik.html" },
      ];
  
    const navbarHtml = navItems.map(item => {
      const isActive = currentSite === item.page ? 'id="isactiv"' : '';
      return `
        <li ${isActive}>
          <div class="nav-item">
            <a href="${item.href}"><img src="${item.img}" alt="${item.alt}" /></a>
          </div>
        </li>
      `;
    }).join('');
  
    const navbar = document.querySelector('#navbar') as HTMLElement | null;
if (navbar) {
    navbar.innerHTML = `
    ${navbarHtml}
    <div class="farbverlaufnav">
      <img src="./public/book.png" alt="book" id="bookimage" />
    </div>
  `;
}
  }