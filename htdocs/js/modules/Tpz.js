// function to set a given theme/color-scheme
function setTheme(themeName) {
            localStorage.setItem('theme', themeName);
            document.documentElement.className = themeName;
}
// Immediately invoked function to set the theme on initial load
(function () {
            if (localStorage.getItem('theme') === 'theme-dark') {
                setTheme('theme-dark');
            } else {
                setTheme('theme-light');
            }
})();
function summ(en){  
	var sum= 0;        
    var inputs= document.getElementsByName(en);
        for (var i= inputs.length; i-->0;) {
            var v= inputs[i].value.split(',').join('.').split(' ').join('');
            if (isNaN(+v))
                alert(inputs[i].value+' is not a readable number');
            else
                sum+= +v;
        }
        document.getElementById('sum'+en).value= sum;   	
};
function OkBut_change(en){
	window.opener.document.getElementById("Tpz").value=document.getElementById("sum"+en).value;
	window.close();
}
