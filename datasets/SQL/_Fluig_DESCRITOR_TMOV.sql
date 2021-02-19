USE [corporerm]
GO

/****** Object:  View [dbo].[_Fluig_DESCRITOR_TMOV]    Script Date: 18/02/2021 17:16:24 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE VIEW [dbo].[_Fluig_DESCRITOR_TMOV]

AS

SELECT 
TMOV.IDMOV,
FCFO.NOMEFANTASIA+' - '+format (TMOV.VALORBRUTO, 'c', 'pt-br') as DESCRITOR

FROM TMOV 
		JOIN TITMMOVWFLUIG ON (TMOV.IDMOV=TITMMOVWFLUIG.IDMOV)
		JOIN FCFO ON (TMOV.CODCFO=FCFO.CODCFO)


GO
