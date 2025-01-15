const svg = d3.select("svg");
const margin = { top: 40, right: 20, bottom: 60, left: 250 };
const width = svg.attr("width") - margin.left - margin.right;
const height = svg.attr("height") - margin.top - margin.bottom;

const chart = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

let isFullDataShown = false;

// Data from pivot.py output
const rawData = [
    { reason: "Enforcement & Abandoned Vehicles", count: 61541 },
    { reason: "Sanitation", count: 59389 },
    { reason: "Street Cleaning", count: 45659 },
    { reason: "Highway Maintenance", count: 25096 },
    { reason: "Signs & Signals", count: 11209 },
    { reason: "Trees", count: 10390 },
    { reason: "Housing", count: 7590 },
    { reason: "Needle Program", count: 7413 },
    { reason: "Park Maintenance & Safety", count: 7932 },
    { reason: "Recycling", count: 9955 }
];

const fullData = rawData.concat([
    { reason: "Animal Issues", count: 4155 },
    { reason: "Environmental Services", count: 4416 },
    { reason: "Building", count: 5209 },
    { reason: "Code Enforcement", count: 31812 },
    { reason: "Graffiti", count: 1839 },
]);

const xScale = d3.scaleLinear().range([0, width]);
const yScale = d3.scaleBand().range([0, height]).padding(0.1);

const render = (data) => {
    xScale.domain([0, d3.max(data, d => d.count)]);
    yScale.domain(data.map(d => d.reason));

    // Clear existing content
    chart.selectAll("*").remove();

    // Bars
    chart.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", d => yScale(d.reason))
        .attr("width", d => xScale(d.count))
        .attr("height", yScale.bandwidth())
        .attr("fill", "#4CAF50");

    // Bar labels
    chart.selectAll(".label")
        .data(data)
        .enter().append("text")
        .attr("x", d => xScale(d.count) + 5)
        .attr("y", d => yScale(d.reason) + yScale.bandwidth() / 2)
        .attr("dy", ".35em")
        .text(d => d.count)
        .style("font-size", "12px");

    // Y-axis
    chart.append("g")
        .call(d3.axisLeft(yScale));

    // X-axis
    chart.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).ticks(5));
};

// Render top 10 data initially
render(rawData);

// Toggle between top 10 and full data
d3.select("#toggle-chart").on("click", () => {
    isFullDataShown = !isFullDataShown;
    render(isFullDataShown ? fullData : rawData);
    d3.select("#toggle-chart").text(isFullDataShown ? "Show Top 10" : "Show Full Data");
});
