document.addEventListener("DOMContentLoaded", function () {
    const csvUrl = "https://raw.githubusercontent.com/shaktids/stock_app_test/main/dump.csv"; 
    const companyList = document.getElementById("company-list");
    const ctx = document.getElementById("stockChart").getContext("2d");
    let stockChart;

function fetchCSV() {
    fetch("stocks.csv") // ✅ Load the new CSV file
        .then(response => response.text())
        .then(csvData => processCSV(csvData))
        .catch(error => console.error("Error loading CSV:", error));
}

    
    function processCSV(csvData) {
        console.log("Raw CSV Data:", csvData); // ✅ Debug Step 1
    
        const rows = csvData.split("\n").map(row => row.split(",").map(field => field.replace(/"/g, "").trim()));
        console.log("Parsed CSV Rows:", rows); // ✅ Debug Step 2
    
        if (rows.length < 2) {
            console.error("Invalid CSV format");
            return;
        }
    
        const companyMap = {};
        let companyCount = 0;
    
        rows.slice(1).forEach((row, index) => {
            if (row.length < 3) return;
    
            const company = row[0];
            const date = row[1];
            const price = parseFloat(row[2]);
    
            if (!company || !date || isNaN(price)) return; // Ignore invalid rows
    
            if (!companyMap[company]) {
                if (companyCount >= 10) return; // ✅ Stop after 10 companies
                companyMap[company] = [];
                companyCount++;
            }
    
            companyMap[company].push({ date, price });
        });
    
        console.log("Final 10 Companies:", Object.keys(companyMap)); // ✅ Debug Step 3
        displayCompanies(companyMap);
    }
    
    
    
    

    function displayCompanies(companyMap) {
        companyList.innerHTML = "";
        Object.keys(companyMap).forEach(company => {
            const li = document.createElement("li");
            li.classList.add("list-group-item");
            li.textContent = company;
            li.onclick = () => showChart(companyMap[company]);
            companyList.appendChild(li);
        });
    }

    function showChart(data) {
        if (!data.length) {
            console.warn("No data available for this company.");
            return;
        }

        const labels = data.map(d => d.date);
        const prices = data.map(d => d.price);

        if (stockChart) {
            stockChart.destroy();
        }

        stockChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Stock Price",
                    data: prices,
                    borderColor: "blue",
                    backgroundColor: "rgba(0, 0, 255, 0.1)",
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { display: true, title: { display: true, text: "Date" } },
                    y: { display: true, title: { display: true, text: "Price" } }
                }
            }
        });
    }

    fetchCSV();
});
