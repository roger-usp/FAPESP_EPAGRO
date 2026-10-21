function formatColorbarValue(value) {
    const units = [
        {threshold: 1e9, divisor: 1e9, suffix: "B"},
        {threshold: 1e6, divisor: 1e6, suffix: "M"},
        {threshold: 1e3, divisor: 1e3, suffix: "k"}
    ];
    const absValue = Math.abs(value);

    if (absValue >= 1e12) {
        return value.toExponential(2);
    }

    if (absValue < 1e3) {
        return value.toString();
    }

    let unitIndex = units.findIndex(unit => absValue >= unit.threshold);
    let scaledValue;
    let decimalPlaces;

    while (unitIndex < units.length) {
        const unit = units[unitIndex];
        scaledValue = value / unit.divisor;
        decimalPlaces = Math.max(0, 2 - Math.floor(Math.log10(Math.abs(scaledValue))));
        scaledValue = Number(scaledValue.toFixed(decimalPlaces));

        if (Math.abs(scaledValue) < 1e3) {
            return `${scaledValue.toFixed(decimalPlaces)}${unit.suffix}`;
        }

        if (unitIndex === 0) {
            return value.toExponential(2);
        }

        unitIndex--;
    }
}


function makeColorbar(div_id, title, n_divisions, cmap) {
    // The div provided must have a height and width
    let cbar_container = document.getElementById(div_id);
    cbar_container.className = "colorbar_container000";
    cbar_container.innerHTML = "";
    
    let cbar_title = document.createElement("p");
    cbar_title.className = "colorbar_title000";
    cbar_title.innerHTML = title;


    let cbar = document.createElement("div");
    cbar.className = "colorbar000";

    let legend = document.createElement("div");
    legend.className = "legend000";

    // filling the color section
    for (let i=0; i<n_divisions; i++) {
        let percentage = i/n_divisions;
        let color = cmap.getHEXperc(percentage);

        let color_entry = document.createElement("div");
        color_entry.className = "color_entry000";
        color_entry.style.backgroundColor = color;
        color_entry.style.width = (100/(n_divisions+1)).toString() + "%"

        if (i === 0) {
            color_entry.style.borderRadius = "10px 0 0 10px"
        }

        else if (i === n_divisions - 1) {
            color_entry.style.borderRadius = "0 10px 10px 0"
        }

        cbar.appendChild(
            color_entry
        )
    }

    // filling the legend section
    for (let i=0; i<n_divisions+1;i++) {
        let percentage = i/n_divisions;
        var val = Math.round(cmap.minVal + percentage*(cmap.maxVal - cmap.minVal));
        val = formatColorbarValue(val);

        let legend_entry = document.createElement("div");
        legend_entry.className = "legend_entry000";
        legend_entry.innerHTML = val;
        legend_entry.style.width = (100/(n_divisions+1)).toString() + "%"
        legend.appendChild(
            legend_entry
        )
    }

    cbar_container.appendChild(cbar_title);
    cbar_container.appendChild(cbar);
    cbar_container.appendChild(legend);
}