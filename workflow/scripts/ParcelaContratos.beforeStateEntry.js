var SeqAtualizaWf = 116;
var SeqCancelaMov = 134;
var SeqFaturaMov = 22;
var SeqConcluiMov = 24;
var SeqGestorCC = 145;

function beforeStateEntry(sequenceId){

	log.info("beforeStateEntry "+sequenceId);
	
	//Define Respons?vel
    if (sequenceId == SeqAtualizaWf) {
    	atualizaEtapaWorkflow();
    }  
    else if (sequenceId == SeqGestorCC) {
    	atualizaSeqGestorCC();
    	anexaDocumentos();
    	preencheDescritor();
    }  
    else
	// De acordo com os estados finais ? passada a a??o a ser realizada no Movimento
    if (sequenceId == SeqCancelaMov)
    	AtualizaMovimento("Cancela");
	else if (sequenceId == SeqConcluiMov)
		AtualizaMovimento("Conclui");
	else if (sequenceId == SeqFaturaMov)
		AtualizaMovimento("Fatura");   
}

function AtualizaMovimento(acaoMovimento){
	try 
	{		
		log.info("AtualizaMovimento: "+acaoMovimento);
		
		var codColigada = hAPI.getCardValue("CodColigada"); 
		var idMov = hAPI.getCardValue("IdMov");
		var idFluig = getValue('WKNumProces');
		
		var cCompany = DatasetFactory.createConstraint("companyId", getValue("WKCompany"), getValue("WKCompany"), ConstraintType.MUST);	
		log.info("cCompany: "+getValue("WKCompany"));
		var cUser = DatasetFactory.createConstraint("colleagueId", getValue("WKUser"), getValue("WKUser"), ConstraintType.MUST);	
		log.info("cUser: "+getValue("WKUser"));
		var constraintsEmail = new Array(cCompany, cUser);
		var colleague = DatasetFactory.getDataset("colleague", null, constraintsEmail, null);
		
		var Email = colleague.getValue(0, "mail");
		
		// Passa as chaves do Movimento e o servi?o que dever? ser chamado.
		var fields = new Array(codColigada, idMov, acaoMovimento , Email, idFluig);
		
		log.info("Passou: "+acaoMovimento);
		
		var dsServiceMov = DatasetFactory.getDataset("wsDataSetServiceMov", fields, null, null);	
		
		if(dsServiceMov.getColumnsName()[0] == "ERROR"){
			throw dsServiceMov.getValue(0, "ERROR");
		}
			
		log.info("Retorno Dataset: AtualizaMovimento: "+ dsServiceMov);
	}
	catch (e)
	{
		log.error(e);
		throw e;
	}	
}

function atualizaEtapaWorkflow(){
	try {
		
		log.info("==========[ atualizaEtapaWorkflow ENTROU ]==========");
		
		var processo = getValue("WKNumProces");     //Recupera o numero da solicitação
		var requisitante = getValue("WKUser");		//Recupera o usuário corrente associado a atividade
		
		// Gravando valores no formulário
		hAPI.setCardValue("n_solicitacao", processo);
	    hAPI.setCardValue("solicitante", requisitante);
	    
	    // Coletando variáveis para consulta de dataSet
	    var id_mov = hAPI.getCardValue("IdMov");
	    var codcoligada = 1;
	    
	    // Array com varáveis coletadas
	    var fields = new Array(codcoligada, id_mov, processo);
	    //log.info("==========[ atualizaEtapaWorkflow fields ]=========="+fields);
	    
	    // Chamada do dataset
	    var dsNucleus = DatasetFactory.getDataset('wsDatasetNucleus', fields, null, null);
	    //log.info("==========[ atualizaEtapaWorkflow dsNucleus ]=========="+dsNucleus);
	    
	    // Coletando XML do retorno
	    var retorno = dsNucleus.getValue(0, "XML");
		//log.info("==========[ atualizaEtapaWorkflow retorno ]========== " + retorno);
        
		// Ajustando retorno XML para retirada de elemento
        var factory = javax.xml.parsers.DocumentBuilderFactory.newInstance();
        var parser = factory.newDocumentBuilder();
        var source = new org.xml.sax.InputSource(new java.io.StringReader(retorno));
        var xmlResponse = parser.parse(source);
        
        // 1º Retirando o elemento 2º Retirando o conteúdo
        var nodes = xmlResponse.getElementsByTagName("CODCCUSTO");
        var ccusto = nodes.item(0).getTextContent();
        //log.info("==========[ atualizaEtapaWorkflow nodes CODCCUSTO ]========== " + nodes.item(0).getTextContent());
 
        // Rodando novo dataset para coletar responsável do centro de custo
        var c1 = DatasetFactory.createConstraint("CODCCUSTO", ccusto, ccusto, ConstraintType.MUST);
        var constraints = new Array(c1);
        //log.info("==========[ atualizaEtapaWorkflow constraints ]========== " + constraints);
        
        // Executando chamada de dataset
        var datasetReturned = DatasetFactory.getDataset("_RM_GESTOR_CENTRO_CUSTO", null, constraints, null);
        
		// Retirando o campo do resultado
		var chefe = datasetReturned.getValue(0, "RESPONSAVEL");
		//log.info("==========[ atualizaEtapaWorkflow createDataset chefe ]========== " + chefe);        
        
        // Gravando retorno no formulário		
		hAPI.setCardValue("gestorcc", chefe);
		
		    	
		
		}
	
	catch (e)
	{
		log.error(e);
		throw e;
	}
}



function atualizaSeqGestorCC() {
	try {
		

		log.info("==========[ atualizaSeqGestorCC Entrou ]========== " );
		
	  	/////////////////////////////////////////////
	  	//		COLETANDO INFORMAÇÕES DE TMOV  	   //
	  	/////////////////////////////////////////////
		
		var idMov = hAPI.getCardValue("IdMov");
		log.info("==========[ atualizaSeqGestorCC idMov ]========== " + idMov);
		
		// Preparacao de filtro para consulta
		var i1 = DatasetFactory.createConstraint("IDMOV", idMov, idMov, ConstraintType.MUST);
		var constraints = new Array(i1);
		log.info("==========[ atualizaSeqGestorCC constraints idMov ]========== " + constraints);
		
		var datasetReturned = DatasetFactory.getDataset("_RM_TMOV", null, constraints, null);
		log.info("==========[ atualizaSeqGestorCC  datasetReturned _RM_TMOV]========== " + datasetReturned);
		
		// Retirando o campo do resultado
        var codfilial = datasetReturned.getValue(0, "CODFILIAL");
        log.info("==========[ atualizaSeqGestorCC codfilial ]========== " + codfilial);		
		
        		
	  	/////////////////////////////////////////////
	  	//		ATRIBUINDO GRUPO ANALISE FISCAL	   //
	  	/////////////////////////////////////////////

        if (codfilial == "1") {
        	var fiscalAprov = "Pool:Group:w_AnaFiscais_BSB";
        }
        else {
        	var fiscalAprov = "Pool:Group:w_AnaFiscais_RIO";
        }
        
        log.info("==========[ atualizaSeqGestorCC fiscalAprov ]========== " + fiscalAprov);	
        
        hAPI.setCardValue("fiscalAprov", fiscalAprov);
        
	}
	
	catch (e)
	{
		log.error(e);
		throw e;
		}
	
}




function preencheDescritor(){
	try {
		
		log.info("==========[ preencheDescritor Entrou ]========== " );
		
	  	/////////////////////////////////////////////
	  	//		COLETANDO INFORMAÇÕES DE TMOV  	   //
	  	/////////////////////////////////////////////
		
		var idMov = hAPI.getCardValue("IdMov");
		log.info("==========[ preencheDescritor idMov ]========== " + idMov);
		
		// Preparacao de filtro para consulta
		var i1 = DatasetFactory.createConstraint("IDMOV", idMov, idMov, ConstraintType.MUST);
		var constraints = new Array(i1);
		log.info("==========[ preencheDescritor constraints idMov ]========== " + constraints);
		
		var datasetReturned = DatasetFactory.getDataset("_RM_DESCRITOR_TMOV", null, constraints, null);
		log.info("==========[ preencheDescritor  datasetReturned _RM_DESCRITOR_TMOV]========== " + datasetReturned);
		
		// Retirando o campo do resultado
        var descritor = datasetReturned.getValue(0, "DESCRITOR");
        log.info("==========[ preencheDescritor ]========== " + descritor);		
		
	  	/////////////////////////////////////////////
	  	//			ATRIBUINDO NO FORMULARIO       //
	  	/////////////////////////////////////////////
        
        hAPI.setCardValue("descritor", descritor);
    	
		
	}
	
	catch (e) {
		log.error(e);
		throw e;
	}
	
} 



function anexaDocumentos(){
	try {
		log.info("==========[ anexaDocumentos ENTROU ]==========");
		
		
	  	////////////////////////////////////////////////////////
	  	//			CRIANDO LISTA COM DOC. JÁ ANEXADOS        //
	  	///////////////////////////////////////////////////////

		var attachments = hAPI.listAttachments(); // Retorna a lista de anexos do processo.
		var listaDocumentos = [];
		if (attachments != "") {
			for (var i = 0; i < attachments.size(); i++) {
				var attachment = attachments.get(i);
				var adicionar = listaDocumentos.push(attachment.getDocumentId());
			}
		} 
		
		log.info("==========[ anexaDocumentos listaDocumentos ]==========" + listaDocumentos);
		

	  	/////////////////////////////////////////////////////////
	  	//			RASTREAMENTO DOS MOVIMENTOS PARA ANEXO    //
	  	////////////////////////////////////////////////////////
		
		
		var idMov = hAPI.getCardValue("IdMov");
		log.info("==========[ anexaDocumentos idMov ]=========="+idMov);
		
		// Rastreando movimentos
		var consultaRastreio = DatasetFactory.createConstraint("IDMOV", idMov, idMov, ConstraintType.MUST);
		var constraints = new Array(consultaRastreio);
		log.info("==========[ anexaDocumentos createDataset constraints ]========== " + constraints);	
		
		// coleta dados do dataset, utlizando filtro
		var datasetRastreio = DatasetFactory.getDataset("_RM_RASTREIAMOVIMENTOS", null, constraints, null);
		log.info("==========[ anexaDocumentos createDataset datasetRastreio ] ========== " + datasetRastreio);	 
		
		// Consultando a quantidade de arquivos retornados
		var quantMovimento   = datasetRastreio.rowsCount;
		log.info("==========[ anexaDocumentos quantidade ]========== " + quantMovimento);
		
		// Retirando o campo do resultado
		var e;
		for (e = 0; e < quantMovimento ; e++){
			log.info("==========[ for rastreamento entrou ]========== ");
			var movimento = datasetRastreio.getValue(e, "IDMOV");
			log.info("==========[ for rastreamento movimento ]========== " + movimento);
			
			//Iniciando coleta para o laço que irá inserir os documentos de cada movimento
			var doc1 = DatasetFactory.createConstraint("IDMOV", movimento, movimento, ConstraintType.MUST);
			var constraints = new Array(doc1);
			log.info("==========[ anexaDocumentos createDataset constraints ]========== " + constraints);
				    
			// coleta dados do dataset, utlizando filtro
			var datasetDocumento = DatasetFactory.getDataset("_RM_GED_TMOV", null, constraints, null);
			log.info("==========[ anexaDocumentos createDataset datasetReturned ] ========== " + datasetDocumento);	 
			
			// Consultando a quantidade de arquivos retornados
			var quant   = datasetDocumento.rowsCount;
			log.info("==========[ anexaDocumentos quant ]========== " + quant);
			
			//Retirando o campo do resultado
			var i;
			for (i = 0; i < quant ; i++){
				log.info("==========[ anexaDocumentos FOR entrou ]========== ");
				var documentId = datasetDocumento.getValue(i, "CODDOCUMENTO");
				log.info("==========[ anexaDocumentos documentId ]========== " + documentId);
				
				
				var existeDoc = false;
				
				var d;
				for (d = 0; d <  listaDocumentos.length; d++) {
					 var documento = listaDocumentos[d];
					 if (documento == documentId) {
						 existeDoc = true;
					 }
					 else {
						 continue;
					 }
				}
					
				if (listaDocumentos == "" || existeDoc == false ) { // Quando não exitir nada ou não existir o documento o mesmo será anexado
					log.info("==========[ anexaDocumentos if item ENTROU listaDocumentos ]========== " + listaDocumentos);
					log.info("==========[ anexaDocumentos if item ENTROU documentId ]========== " + documentId);
					log.info("==========[ anexaDocumentos if item ENTROU existeDoc ]========== " + existeDoc);
					
					log.info("==========[ anexaDocumentos if item ENTROU attachDocument ]========== " + documentId);
					hAPI.attachDocument(documentId); // Comando para inserir documentos em anexo ao formulário.

				}
				else {
					continue;
				}
			}
			
			
			}		
	}
	
	catch (e)
	{
		log.error(e);
		throw e;
	}
}
