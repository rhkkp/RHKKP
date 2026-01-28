 // 1. YouTube Popup Logic
function openYT(url) {
    document.getElementById('ytModal').style.display = 'block';
}
function closeYT() {
    document.getElementById('ytModal').style.display = 'none';
    document.getElementById('ytFrame').src = "";
}

// 2. Registration Form Logic
function openRegForm() { document.getElementById('regModal').style.display = 'block'; }
function closeRegForm() { document.getElementById('regModal').style.display = 'none'; }

// 3. Voting System (Visual Tank)
function castVote(id) {
    let tank = document.getElementById(id);
    let v = parseInt(tank.getAttribute('data-v') || 0) + 1;
    tank.setAttribute('data-v', v);
    
    let p = Math.min((v / 200) * 100, 100);
    tank.style.width = p + "%";
    
    tank.classList.remove('f-low', 'f-mid', 'f-high');
    if(v >= 1 && v <= 50) tank.classList.add('f-low');
    else if(v >= 51 && v <= 100) tank.classList.add('f-mid');
    else if(v >= 101) tank.classList.add('f-high');
}

// 4. RAZORPAY PAYMENT FUNCTION
function startPayment() {
    const name = document.querySelector('input[type="text"]').value;
    const phone = document.querySelector('input[type="number"]').value;

    if (!name || !phone) {
        alert("Paji, please pehla form poora bharo!");
        return;
    }

    const options = {
        "key": "rzp_test_XXXXXXXXXXXXXX", 
        "amount": 1500 * 100, 
        "currency": "INR",
        "name": "RH Production House",
        "description": "Talent Registration Fee",
        "handler": function (response) {
            alert("Payment Successful! ID: " + response.razorpay_payment_id);
            closeRegForm(); 
        },
        "prefill": { "name": name, "contact": phone },
        "theme": { "color": "#D4AF37" }
    };

    const rzp = new Razorpay(options);
    rzp.open();
}

// 5. Splash Screen Logic
setTimeout(() => { 
    let s = document.getElementById('splash');
    if(s) s.style.display = 'none'; 
}, 2000);

// 6. Candidates Database & Render (Jo tusi bhejya si)
let candidates = [];
for(let i=1; i<=20; i++) {
    candidates.push({ id: i, name: "Candidate " + i, votes: 0 });
}

function render() {
    const list = document.getElementById('candidatesList');
    const admin = document.getElementById('adminPanel');
    if(list) list.innerHTML = ''; 
    if(admin) admin.innerHTML = '';

    candidates.forEach(c => {
        let perc = (c.votes / 200) * 100;
        let color = '';
        if(c.votes > 0 && c.votes <= 50) color = 'glow-red';
        else if(c.votes > 50 && c.votes <= 100) color = 'glow-yellow';
        else if(c.votes > 100) color = 'glow-green';
        
        // Render logic can be expanded here if needed
    });
}
// Initial Call
render();

// Payment Function shuru hunda hai
function payNow() {
    var options = {
        "key": "YOUR_TEST_KEY_ID", // ITHE APNI rzp_test_... WALI KEY PAO
        "amount": "150000", // 1500 INR (Razorpay paise vich mangda hai, is layi 100 naal multiply kita)
        "currency": "INR",
        "name": "Rhkkp",
        "description": "Talent Hunt Registration Fee",
        "image": "https://rhkkp.github.io/RHKKP/logo.png", // Je logo hai taan link pao
        "handler": function (response){
            // Jad payment successful ho jave
            alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
            // Ithe tusi user nu success page te bhej sakde ho
        },
        "prefill": {
            "name": "", // User da naam (optional)
            "email": "", // User di email
            "contact": "" // User da phone number
        },
        "theme": {
            "color": "#3399cc" // Tusi apni website mutabik color badal sakde ho
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.open();
}