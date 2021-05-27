function createDataset(fields, constraints, sortFields) {
    var newDataset = DatasetBuilder.newDataset();
    var dataSource = "/jdbc/FluigRM"; 
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);
    var created = false;
    
    log.info("QUERY constraints: " + constraints);
    
    var processo = "";
    for (var i = 0; i < constraints.length; i++) {
        if (constraints[i].fieldName == 'CODCCUSTO') {
            processo = constraints[i].initialValue;    
        }
    }
    
    /*	DRº LEANDRO VPF - 12/05/2021
		DE    	18.01.01.01.58051	Gabinete da Vice-Presidência Financeira - DF
				20.01.01.03.71020	CNC II - Brasília DF - SBN QD 02 Bloco E
				20.01.01.04.71030	Brasília DF - Ed. Jessé Freire
				20.01.01.06.71070	CNC III - Brasília DF - SBN QD 02 Bloco L
				20.01.01.07.71080	CNC IX - Brasília DF - Ed. SEP/Sul EQ 713/913 Bloco E
				20.01.01.08.71090	CNC IV - Brasília DF - SBN QD 02 Bloco N
				20.01.01.09.71100	CNC V a VIII - Brasília DF - Ed. Centro Empresarial CNC
				20.01.01.10.71200	Terreno na SGA/S QD 613/614 Lote 92
				20.01.02.10.70100	Edifício Praia do Flamengo 200
		PARA	18.01.02.01.58001	Gabinete da Vice-Presidência Financeira - RJ
    */
    if (processo == '18.01.01.01.58051' || processo == '20.01.01.03.71020' || processo == '20.01.01.04.71030' || processo == '20.01.01.06.71070' || 
    	processo == '20.01.01.07.71080' || processo == '20.01.01.08.71090' || processo == '20.01.01.09.71100' || processo == '20.01.01.10.71200' || 
    	processo == '20.01.02.10.70100' ) { processo = '18.01.02.01.58001'; }
    
    
    /* DRº ERNANE GALVES - 17/05/2021
      DE		15.01.02.02.56010	Consultoria Econômica da Presidência - RJ
	  PARA		14.01.02.01.52010	Conselho Técnico - RJ
    */
    if (processo == '15.01.02.02.56010' ) {
    		processo = '14.01.02.01.52010'; }
     
    
    
    var myQuery = "SELECT * FROM [dbo].[Fluig_Colaboradores] ('"+processo+"') order by COLABORADOR ";
        
    log.info("QUERY: " + myQuery);
    try {
        var conn = ds.getConnection();
        var stmt = conn.createStatement();
        var rs = stmt.executeQuery(myQuery);
        var columnCount = rs.getMetaData().getColumnCount();
        while (rs.next()) {
            if (!created) {
                for (var i = 1; i <= columnCount; i++) {
                    newDataset.addColumn(rs.getMetaData().getColumnName(i));
                }
                created = true;
            }
            var Arr = new Array();
            for (var i = 1; i <= columnCount; i++) {
                var obj = rs.getObject(rs.getMetaData().getColumnName(i));
                if (null != obj) {
                    Arr[i - 1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString();
                } else {
                    Arr[i - 1] = "null";
                }
            }
            newDataset.addRow(Arr);
        }
    } catch (e) {
        log.error("ERRO==============> " + e.message);
    } finally {
        if (stmt != null) {
            stmt.close();
        }
        if (conn != null) {
            conn.close();
        }
    }
    return newDataset;
}

/*
function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {

}function onMobileSync(user) {

}
*/