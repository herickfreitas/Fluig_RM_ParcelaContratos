USE [Corporerm_Homolog]
GO

/****** Object:  UserDefinedFunction [dbo].[Fluig_Autorizadores]    Script Date: 13/04/2021 16:56:36 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



/* funcao retorna os colaboradores que estão vinculados as seções que possuem o mesmo chefe do centro de custo relacionado no processo. */

CREATE FUNCTION [dbo].[Fluig_Colaboradores]  

( @CENTROCUSTO AS VARCHAR(17)) 

RETURNS TABLE

AS

    RETURN ( SELECT  PPESSOA.NOME COLABORADOR, LOWER(PPESSOA.CODUSUARIO) CODUSUARIO
			FROM PFUNC 
				JOIN PPESSOA ON (PFUNC.CODPESSOA=PPESSOA.CODIGO)
			WHERE	CODSITUACAO <> 'D'
			AND		PPESSOA.CODUSUARIO IS NOT NULL
			AND		CODSECAO IN ( 	SELECT CODSECAO /* EM QUAIS SEÇÕES ELE É CHEFE? */
										FROM PSUBSTCHEFE 
									WHERE CHAPASUBST IN (	SELECT CHAPASUBST /* CHEFE DO CENTRO DE CUSTO INFORMADO */
																FROM PSUBSTCHEFE
																JOIN PSECAO ON (PSUBSTCHEFE.CODSECAO=PSECAO.CODIGO)
															WHERE	PSECAO.NROCENCUSTOCONT = @CENTROCUSTO))
	)


    

GO


