function displayFields(form,customHTML){ 
		
	// Fields
	var codcoligada = form.getValue("CodColigada"); 
	var idmov = form.getValue("IdMov");
	var idFluig = getValue('WKNumProces');
	
	form.setValue("IdentificadorFluig", idFluig);
	
	var fields = new Array(codcoligada, idmov, idFluig);

	log.info("displayFields:"+ fields);

	form.setShowDisabledFields(true);
	form.setHidePrintLink(true);
	
	
	
	/* Tratamento da div para seleção do ponto focal */
	
	var activity = getValue('WKNumState');
	var gestorCCusto = 55;
	
	customHTML.append("<script>");
	customHTML.append("$(document).ready(function(){ "); 
	
	
	if (activity != gestorCCusto)  {
		
		customHTML.append("$('#dvGestorCentroCusto').hide();");
	}
	
	else {
		
		customHTML.append("$('#dvGestorCentroCusto').show();");

	}
	
	customHTML.append(" });");
	customHTML.append("</script>");
}