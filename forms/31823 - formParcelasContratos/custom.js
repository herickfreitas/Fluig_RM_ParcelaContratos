
function filtrazoom(codccusto){
	/* Aplicando filtro para o id = "pontoFocal"  */
	var custo = codccusto;
	var filterValues = "CODCCUSTO," + custo;
	//console.log("filterValues: "+filterValues );
	reloadZoomFilterValues('pontoFocal', filterValues );
}