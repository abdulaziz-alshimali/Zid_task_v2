document.addEventListener('DOMContentLoaded', async () => {
    let cart = [];
    let hotProducts = [];
    let recentProducts = [];
    let body = document.getElementById("body");
    let cartbody = document.getElementById("cart");
    let product = document.getElementById('product');


    await axios.get('https://catalog-json-server.herokuapp.com/')
        .then(res => {
            cart = res.data.cart.items;
            hotProducts = res.data.layout.body.hot_products;
            recentProducts = res.data.layout.body.recent_products;
            store = res.data.store;
            navi = res.data.layout.navigation;
            messages = res.data.layout.messages;
            layout = res.data.layout;

        })
        .catch(error => {
            console.log(error);
        });


    function cover() {
        var msgs = document.getElementById("msgs");
        for (var i = 0; i < messages.length; i++) {
            var div = document.createElement("div");
            msgs.appendChild(div);
            div.setAttribute('class', 'alert alert-info');
            div.setAttribute('role', 'alert');

            var h4 = document.createElement("h4");
            div.appendChild(h4);
            h4.innerHTML = messages[i].text;
            div.style.background = messages[i].background_color;
            div.style.color = messages[i].text_color;
            div.style.border = '0px ';
            if (i === 0) {
                div.style.marginBottom = '0px';
                var div = document.createElement("div");
                var img = document.createElement("img");
                msgs.appendChild(div);
                div.appendChild(img);
                img.src = layout.body.cover_image;
                img.style.height = 'auto';
                img.style.width = '100%';
            }
        }
    }
    cover()

    function navBar() {
        var homebtn = document.querySelector(".home");
        var cartbtn = document.querySelector(".cartbtn");
        var dropDown = document.querySelector(".dropdown-menu");
        var storeName = document.getElementById("brandName");
        var curr = document.getElementById("currency");
        var logo = document.getElementById("logo");
        var signin = document.getElementById("signbtn");
        storeName.innerHTML = store.name;
        curr.innerHTML = store.currency;
        logo.src = layout.logo;
        signin.setAttribute('type', navi.actions[0].type);
        signin.innerHTML = navi.actions[0].text;
        signin.setAttribute('href', navi.actions[0].value);
        for (var i = 0; i < navi.categories.length; i++) {
            var li = document.createElement("li");
            dropDown.appendChild(li);
            var a = document.createElement("a");
            li.appendChild(a);
            a.innerHTML = navi.categories[i].name;
            a.setAttribute('href', navi.categories[i].link);
        }
    }
    navBar();

    function showHome() {
        body.innerHTML = '';
        var div = document.createElement("div");
        var h4 = document.createElement("h4");
        body.setAttribute('class', 'row');

        for (let i = 0; i < hotProducts.length; i++) {
            if (i === 0) {
                var h4 = document.createElement("h4");
                var div1 = document.createElement("div");
                body.appendChild(div1);
                div1.setAttribute('class', 'col-md-12 thumbnail')
                div1.appendChild(h4);
                h4.innerHTML = 'Hot Products';
                h4.style.textAlign = 'center';
            }
            div = document.createElement("div");
            body.appendChild(div);
            div.setAttribute('class', 'col-sm-6 col-md-4 ')
            div.innerHTML = `
              <div class="thumbnail">
               <img src="${hotProducts[i].image}" alt="">
                <div class="caption">
                <a  > <h3 id="${hotProducts[i].sku+'H'}">${hotProducts[i].name}</h3></a>
                  <h5>${hotProducts[i].price} ${store.currency}</h5>
                  <h6 style="text-decoration:line-through;">${hotProducts[i].old_price !==null ?`${hotProducts[i].old_price}${store.currency}`:''} </h6>
                  <p> <a id="${hotProducts[i].id *10}" class="btn btn-default atcbtn ${hotProducts[i].stock_status ==='Available'?'':'disabled btn-danger'}" role="button">${hotProducts[i].stock_status ==='Available'?'Add to Cart':'Out of Stock'}</a>
                  <a href="${hotProducts[i].share_link}"><span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span></a>

                  </p>
                </div>
              </div>
          `;
            const goToP = document.getElementById(hotProducts[i].sku + 'H');
            goToP.addEventListener('click', pPage);
            const addBtn = document.getElementById(hotProducts[i].id * 10);
            addBtn.addEventListener('click', add);

        }

        for (let i = 0; i < recentProducts.length; i++) {
            if (i === 0) {
                var h4 = document.createElement("h4");
                var div = document.createElement("div");
                body.appendChild(div);
                div.setAttribute('class', 'col-md-12 thumbnail')
                div.appendChild(h4);
                h4.innerHTML = 'Recent Products';
                h4.style.textAlign = 'center';
            }
            if (i > 3) {
                recentProducts[i].sku += 'R1'
                if (i > 6) {
                    recentProducts[i].sku += 'R2'
                }
            }
            div = document.createElement("div");
            body.appendChild(div);
            div.setAttribute('class', 'col-sm-6 col-md-4 ')
            div.innerHTML = `
                  <div class="thumbnail">
                    <img src="${recentProducts[i].image}" alt="">
                    <div class="caption">
                     <a > <h3 id="${recentProducts[i].sku+'R'}">${recentProducts[i].name}</h3></a>
                      <h5>${recentProducts[i].price} ${store.currency}</h5>
                      <h6 style="text-decoration:line-through;">${recentProducts[i].old_price !==null ?`${recentProducts[i].old_price}${store.currency}`:''}</h6>
                      <p> <a  id="${recentProducts[i].id}" class="btn btn-default ${recentProducts[i].stock_status ==='Available'?'':'disabled btn-danger'}" role="button">${recentProducts[i].stock_status ==='Available'?'Add to Cart':'Out of Stock'}</a>
                      <a href="${recentProducts[i].share_link}"><span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span></a>

                      </p>
                    </div>
                  </div>
                
              `;
            const goToP = document.getElementById(recentProducts[i].sku + 'R');
            goToP.addEventListener('click', pPage);
            const addBtn = document.getElementById(recentProducts[i].id);
            addBtn.addEventListener('click', add);


        }

    }
    showHome();

    function inCart(id) {
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].id === id) {
                return true;
            }
        }
        return false;
    }

    function add(event) {
        let id = parseInt(event.target.id);
        let item = hotProducts.find(function (hotProduct) {
            return hotProduct.id === id / 10;
        }) || recentProducts.find(function (recentProduct) {
            return recentProduct.id === id;
        });

        if (inCart(item.id)) {
            for (let i = 0; i < cart.length; i++) {
                if (cart[i].id === item.id) {
                    cart[i].quantity += item.quantity < item.minimum ? item.quantity : item.minimum;

                }
            }
        } else {
            cart.push({
                ...item,
                quantity: item.minimum
            })
        }
        for (let i = 0; i < hotProducts.length; i++) {
            if (hotProducts[i].id === item.id) {
                hotProducts[i].quantity -= hotProducts[i].quantity === 0 ? 0 : item.quantity < item.minimum ? item.quantity : item.minimum;
                hotProducts[i].stock_status = hotProducts[i].quantity === 0 ? 'Unvailable' : 'Available';
            }

        }
        for (let i = 0; i < recentProducts.length; i++) {
            if (recentProducts[i].id === item.id) {
                recentProducts[i].quantity -= recentProducts[i].quantity === 0 ? 0 : item.quantity < item.minimum ? item.quantity : item.minimum;
                recentProducts[i].stock_status = recentProducts[i].quantity === 0 ? 'Unvailable' : 'Available';
            }

        }

        showHome();
    }



    function makecart() {
        cartbody.innerHTML = '';

        cartbody.setAttribute('class', 'row');
        var h2 = document.createElement("h2");
        var div = document.createElement("div");
        var div1 = document.createElement("div");

        cartbody.appendChild(div);
        div.setAttribute('class', 'col-md-12 thumbnail')
        div.appendChild(h2);
        h2.innerHTML = 'Cart';
        div.style.marginTop = '20px';
        h2.style.textAlign = 'center';
        cartbody.appendChild(div1);
        div1.setAttribute('class', 'col-md-8 ')
        var table = document.createElement("table");
        div1.appendChild(table);
        table.setAttribute('class', 'table ct');
        table.innerHTML = `<tr>
         <th>Remove</th>
         <th></th>
         <th>Name</th>
         <th>Quantity</th>
         <th>Price</th>  </tr>`;

        for (var i = 0; i < cart.length; i++) {
            var ct = document.querySelector('.ct');
            var tr = document.createElement('tr');
            ct.appendChild(tr);
            tr.setAttribute('id', 'itemInCart')
            tr.innerHTML = `<td id="btn"><a class="remove"><span id="${cart[i].model}" class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span></a></td>
        <td class="img" ><img style="height: 2.5em;" src="${cart[i].image}"></td>
           <td class="name">${cart[i].name}</td>
         <td class="quan">${cart[i].quantity}</td>
         <td class="price">${cart[i].price} ${store.currency}</td>`;
            let removeBtn = document.getElementById(cart[i].model)
            removeBtn.addEventListener('click', remove)
        }


        totalPrice();
    }

    function remove(event) {
        let model = event.target.id;
        let item = cart.find(function (cart) {
            return cart.model === model;
        })
        console.log(hotProducts[0].model === item.model);
        console.log(item.quantity);
        console.log(hotProducts[0].quantity = item.quantity);
        for (let i = 0; i < hotProducts.length; i++) {
            if (hotProducts[i].model === item.model) {
                hotProducts[i].stock_status = 'Available'
                hotProducts[i].quantity = item.quantity;
                console.log(hotProducts[0].quantity);
            }
        }
        cart.splice(item, 1);
        showHome();
        makecart();


    }

    function totalPrice() {
        let totalP = 0;
        let totalPD = 0;
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].old_price == null) {
                totalPD += cart[i].price * cart[i].quantity;
            } else
                totalPD += cart[i].old_price * cart[i].quantity;
        }

        for (let i = 0; i < cart.length; i++) {
            totalP += cart[i].price * cart[i].quantity;
        }
        totalT(totalP, totalPD)
    }

    function totalT(totalP, totalPD) {
        var div = document.createElement("div");

        cartbody.appendChild(div);
        div.setAttribute('class', 'col-md-4 thumbnail total')
        div.innerHTML = `
        <table class="table">
          <tr>
            <th style="border-top:0px;"><h2>Total</h2></th>
          </tr>
          <tr>
            <td><h4>Total before discount</h4></td>
           <td><h4 style="color:red;text-Decoration:line-through;">${totalPD}</h4></td>
          </tr>
          <tr>
            <td><h4 >Total after discount</h4></td>
            <td><h4 >${totalP}</h4></td>

          </tr>
          
        </table>`;
    }

    function onePage() {
        var cb = document.querySelector('#cartbtn')
        var homebtn = document.querySelector(".home");
        let product = document.getElementById('product')

        homebtn.addEventListener('click', function () {
            homebtn.classList.add("active")
            cartbody.style.display = 'none';
            msgs.style.display = 'block';
            body.style.display = 'block';
            showHome();
            cartbtn.classList.remove("active")
            product.innerHTML = ""
        })
        cb.addEventListener('click', function () {
            cartbody.style.display = 'block';
            body.style.display = 'none';
            msgs.style.display = 'none';
            makecart();
            product.innerHTML = ""

            cartbtn.setAttribute('class', 'active');
            homebtn.classList.remove("active");
        })

    }
    onePage();

    function pPage(event) {
        let sku = event.target.id;
        msgs.innerHTML = '';
        body.innerHTML = '';
        let item = hotProducts.find(function (hotProduct) {
                return hotProduct.sku + 'H' === sku;
            }) ||
            recentProducts.find(function (recentProduct) {
                return recentProduct.sku + 'R' === sku ||
                    recentProduct.sku + 'R1' === sku || recentProduct.sku + 'R2' === sku;
            });
        document.getElementById('product');
        product.innerHTML = `  <div  class="jumbotron col-md-12">
        <img style="float:right;margin:2em;" src="${item.image}" alt="">
        
        <h1>${item.name}</h1>
        <p> <span style="text-decoration:line-through;color:red;">${item.old_price !==null ?`${item.old_price}${store.currency}`:''}</span>    ${item.price +store.currency} </p>
    
        <p> <a  id="${item.id}" class="btn btn-default ${item.stock_status ==='Available'?'':'disabled btn-danger'}"
         role="button">${item.stock_status ==='Available'?'Add to Cart':'Out of Stock'}</a></P>
         <p>${item.description}</p>
        </div>`
        const addBtn = document.getElementById(item.id);
        addBtn.addEventListener('click', add);
    }
});